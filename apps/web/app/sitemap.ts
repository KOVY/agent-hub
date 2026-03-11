import type { MetadataRoute } from "next";
import { fetchAllServerSlugs } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://agentforge.community";
  const locales = ["en", "cs"];

  // Static pages
  const staticPages = ["", "/registry", "/pricing", "/privacy", "/terms"];
  const staticEntries = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "daily" as const : "weekly" as const,
      priority: page === "" ? 1 : page === "/registry" ? 0.9 : 0.5,
    }))
  );

  // Dynamic server pages
  let serverEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await fetchAllServerSlugs();
    serverEntries = locales.flatMap((locale) =>
      slugs.map((slug) => ({
        url: `${baseUrl}/${locale}/server/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    );
  } catch {
    // Fail silently — sitemap still works with static pages
  }

  return [...staticEntries, ...serverEntries];
}
