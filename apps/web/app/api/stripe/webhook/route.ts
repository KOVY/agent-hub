import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Update agent_keys monthly_limit for all keys owned by a user.
 * Pro = 10,000 calls/month, Free = 100 calls/month.
 */
async function syncKeyLimits(userId: string, plan: "free" | "pro") {
  const supabase = getServiceClient();
  const limit = plan === "pro" ? 10_000 : 100;

  const { error } = await supabase
    .from("agent_keys")
    .update({ monthly_limit: limit })
    .eq("owner_id", userId);

  if (error) {
    console.error(`Failed to sync key limits for user ${userId}:`, error.message);
  }
}

/**
 * Resolve the Supabase user_id from a Stripe customer.
 * Checks subscription metadata first, then falls back to the subscriptions table.
 */
async function resolveUserId(
  supabase: ReturnType<typeof getServiceClient>,
  metadata: Stripe.Metadata | null,
  customerId: string
): Promise<string | null> {
  // Prefer metadata (set during checkout)
  if (metadata?.supabase_user_id) {
    return metadata.supabase_user_id;
  }

  // Fallback: look up by stripe_customer_id
  const { data } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return data?.user_id ?? null;
}

/**
 * Extract current_period_end from a Stripe Subscription.
 * In Stripe API v2026-02-25, the period lives on subscription items,
 * not on the subscription object itself.
 */
function extractPeriodEnd(subscription: Stripe.Subscription): string | null {
  const firstItem = subscription.items?.data?.[0];
  if (firstItem?.current_period_end) {
    return new Date(firstItem.current_period_end * 1000).toISOString();
  }
  return null;
}

// POST /api/stripe/webhook — Stripe event handler
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getServiceClient();

  switch (event.type) {
    // ── Checkout completed: activate Pro subscription ──────────
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;

      const userId = await resolveUserId(
        supabase,
        session.metadata,
        session.customer as string
      );
      if (!userId) {
        console.error("checkout.session.completed: could not resolve user_id");
        break;
      }

      // Retrieve the full subscription (with items) to get period details
      const stripeSubscription = await getStripe().subscriptions.retrieve(
        session.subscription as string
      );

      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          plan: "pro",
          status: "active",
          current_period_end: extractPeriodEnd(stripeSubscription),
        },
        { onConflict: "user_id" }
      );

      await syncKeyLimits(userId, "pro");
      break;
    }

    // ── Subscription updated (renewal, plan change, etc.) ──────
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const userId = await resolveUserId(
        supabase,
        subscription.metadata,
        customerId
      );
      if (!userId) {
        console.error("customer.subscription.updated: could not resolve user_id");
        break;
      }

      const status = subscription.cancel_at_period_end
        ? "canceled"
        : (subscription.status as string);

      // Map Stripe status to our allowed values
      const mappedStatus = ["active", "canceled", "past_due", "trialing"].includes(status)
        ? status
        : "active";

      await supabase
        .from("subscriptions")
        .update({
          status: mappedStatus,
          current_period_end: extractPeriodEnd(subscription),
        })
        .eq("user_id", userId);

      break;
    }

    // ── Subscription deleted (fully canceled) ──────────────────
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const userId = await resolveUserId(
        supabase,
        subscription.metadata,
        customerId
      );
      if (!userId) {
        console.error("customer.subscription.deleted: could not resolve user_id");
        break;
      }

      await supabase
        .from("subscriptions")
        .update({
          plan: "free",
          status: "canceled",
          stripe_subscription_id: null,
          current_period_end: null,
        })
        .eq("user_id", userId);

      await syncKeyLimits(userId, "free");
      break;
    }

    // ── Payment failed ─────────────────────────────────────────
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const userId = await resolveUserId(supabase, null, customerId);
      if (!userId) {
        console.error("invoice.payment_failed: could not resolve user_id");
        break;
      }

      await supabase
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("user_id", userId);

      break;
    }

    default:
      // Unhandled event type — acknowledge silently
      break;
  }

  return NextResponse.json({ received: true });
}
