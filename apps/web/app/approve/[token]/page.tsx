"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

interface PurchaseRequest {
  id: string;
  status: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    currency: string;
  }>;
  total_amount: number;
  currency: string;
  agent_name: string;
  server_name: string;
  agent_note: string | null;
  expires_at: string;
  created_at: string;
}

export default function ApprovalPage() {
  const { token } = useParams<{ token: string }>();
  const [pr, setPr] = useState<PurchaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const fetchRequest = useCallback(async () => {
    try {
      const res = await fetch(`/api/approve/${token}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Request not found");
        return;
      }
      setPr(data.data);
    } catch {
      setError("Failed to load purchase request");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  async function handleAction(action: "approve" | "reject") {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/approve/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(
          action === "approve"
            ? "Purchase approved! The agent will proceed with the order."
            : "Purchase rejected. The agent has been notified."
        );
        setPr((prev) =>
          prev ? { ...prev, status: action === "approve" ? "approved" : "rejected" } : null
        );
      } else {
        setError(data.error ?? "Action failed");
      }
    } catch {
      setError("Failed to process action");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#141417] border border-white/10 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">&#10060;</div>
          <h1 className="text-xl font-bold text-white mb-2">Request Not Found</h1>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  if (!pr) return null;

  const isExpired = new Date(pr.expires_at) < new Date();
  const isPending = pr.status === "pending" && !isExpired;

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-[#141417] border border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-8 py-6 border-b border-white/10">
          <div className="text-sm text-white/50 mb-1">AgentForge Purchase Request</div>
          <h1 className="text-xl font-bold text-white">
            {pr.agent_name} wants to make a purchase
          </h1>
          <div className="text-sm text-white/60 mt-1">
            via {pr.server_name}
          </div>
        </div>

        {/* Items */}
        <div className="px-8 py-6 space-y-4">
          <div className="space-y-3">
            {pr.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
              >
                <div>
                  <div className="text-white font-medium">{item.name}</div>
                  {item.quantity > 1 && (
                    <div className="text-sm text-white/40">
                      x{item.quantity}
                    </div>
                  )}
                </div>
                <div className="text-white font-mono">
                  {item.price.toFixed(2)} {item.currency}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t border-white/10">
            <span className="text-white/60 font-medium">Total</span>
            <span className="text-xl font-bold text-white">
              {pr.total_amount.toFixed(2)} {pr.currency}
            </span>
          </div>

          {/* Agent note */}
          {pr.agent_note && (
            <div className="bg-white/5 rounded-lg p-3 mt-4">
              <div className="text-xs text-white/40 mb-1">Agent&apos;s note</div>
              <div className="text-sm text-white/80">{pr.agent_note}</div>
            </div>
          )}

          {/* Expiry */}
          <div className="text-xs text-white/30 text-center">
            {isExpired
              ? "This request has expired"
              : `Expires: ${new Date(pr.expires_at).toLocaleString()}`}
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 py-6 border-t border-white/10">
          {result ? (
            <div className="text-center">
              <div className="text-lg mb-2">
                {pr.status === "approved" ? "\u2705" : "\u274C"}
              </div>
              <p className="text-white/80">{result}</p>
            </div>
          ) : isPending ? (
            <div className="flex gap-3">
              <button
                onClick={() => handleAction("reject")}
                disabled={actionLoading}
                className="flex-1 py-3 border border-white/10 rounded-lg text-white/60 hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleAction("approve")}
                disabled={actionLoading}
                className="flex-1 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Approve Purchase"}
              </button>
            </div>
          ) : (
            <div className="text-center text-white/40">
              This request is {pr.status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
