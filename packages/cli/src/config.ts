import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const CONFIG_DIR = join(homedir(), ".agentforge");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

interface Config {
  api_key?: string;
  base_url: string;
  agent_id?: string;
  agent_name?: string;
}

const DEFAULT_CONFIG: Config = {
  base_url: "https://agentforge.community/api/v1",
};

export function loadConfig(): Config {
  if (!existsSync(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
  try {
    const raw = readFileSync(CONFIG_FILE, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: Partial<Config>): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  const current = loadConfig();
  const merged = { ...current, ...config };
  writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2));
}

export function getApiKey(): string | null {
  return process.env.AGENTFORGE_API_KEY || loadConfig().api_key || null;
}

export function getBaseUrl(): string {
  return process.env.AGENTFORGE_URL || loadConfig().base_url;
}
