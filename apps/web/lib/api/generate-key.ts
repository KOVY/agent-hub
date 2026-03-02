import { randomBytes } from "crypto";

export function generateApiKey(): string {
  return `af_${randomBytes(32).toString("hex")}`;
}
