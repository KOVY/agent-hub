import { randomBytes } from "crypto";

export function generateApiKey(): string {
  return `af_${randomBytes(32).toString("hex")}`;
}

export function generateAgentKey(): string {
  return `af_agent_${randomBytes(32).toString("hex")}`;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
