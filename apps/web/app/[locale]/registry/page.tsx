import type { Metadata } from "next";
import { fetchServers } from "@/lib/data";
import { RegistryContent } from "./registry-content";

export const metadata: Metadata = {
  title: "MCP Server Registry",
  description:
    "Browse 10+ verified MCP tool servers. Finance, legal, data, communication, and more — ready for your AI agents.",
};

export default async function RegistryPage() {
  const servers = await fetchServers();

  return <RegistryContent initialServers={servers} />;
}
