#!/usr/bin/env node

import { Command } from "commander";
import { saveConfig, loadConfig, getApiKey } from "./config.js";
import * as api from "./api.js";

const program = new Command();

program
  .name("agentforge")
  .description("AgentForge CLI — discover and connect to MCP tool servers")
  .version("0.1.0");

// ─── Auth ────────────────────────────────────────────────
program
  .command("auth")
  .description("Set API key for authentication")
  .option("--key <key>", "API key (af_agent_* or af_*)")
  .option("--url <url>", "Custom API base URL")
  .action(async (opts) => {
    if (opts.key) {
      saveConfig({ api_key: opts.key });
      console.log("API key saved to ~/.agentforge/config.json");
    }
    if (opts.url) {
      saveConfig({ base_url: opts.url });
      console.log(`Base URL set to: ${opts.url}`);
    }
    if (!opts.key && !opts.url) {
      const config = loadConfig();
      console.log(
        JSON.stringify(
          {
            api_key: config.api_key ? `${config.api_key.slice(0, 12)}...` : null,
            base_url: config.base_url,
          },
          null,
          2
        )
      );
    }
  });

// ─── Register ────────────────────────────────────────────
program
  .command("register")
  .description("Register a new agent identity")
  .requiredOption("--name <name>", "Agent name")
  .option("--description <desc>", "Agent description")
  .action(async (opts) => {
    const res = await api.register(opts.name, opts.description);
    if (res.success) {
      const d = res.data as Record<string, unknown>;
      const agent = d.agent as Record<string, unknown>;
      const key = d.api_key as string;
      saveConfig({
        api_key: key,
        agent_id: agent.id as string,
        agent_name: agent.name as string,
      });
      console.log("Agent registered successfully!");
      console.log(`  ID:   ${agent.id}`);
      console.log(`  Name: ${agent.name}`);
      console.log(`  Key:  ${key}`);
      console.log("\nKey saved to ~/.agentforge/config.json");
    } else {
      console.error(`Error: ${res.error}`);
      process.exit(1);
    }
  });

// ─── Discover ────────────────────────────────────────────
program
  .command("discover")
  .description("Browse MCP servers")
  .option("-q, --query <query>", "Search query")
  .option("-c, --category <cat>", "Filter by category")
  .option("--featured", "Show featured only")
  .option("-n, --limit <n>", "Max results", "10")
  .action(async (opts) => {
    const res = await api.discover({
      q: opts.query,
      category: opts.category,
      featured: opts.featured,
      limit: parseInt(opts.limit),
    });
    if (res.success) {
      const d = res.data as Record<string, unknown>;
      const servers = d.servers as Array<Record<string, unknown>>;
      if (servers.length === 0) {
        console.log("No servers found.");
        return;
      }
      for (const s of servers) {
        const verified = s.is_verified ? " [verified]" : "";
        const price =
          s.pricing_model === "free" ? "free" : `${s.price_monthly} EUR/mo`;
        console.log(
          `  ${s.name}${verified} (${s.category}) — ${s.total_tools} tools, ${price}`
        );
        console.log(`    ${s.description}`);
        console.log(`    slug: ${s.slug}`);
        console.log();
      }
      console.log(`${servers.length} servers found.`);
    } else {
      console.error(`Error: ${res.error}`);
    }
  });

// ─── Server Info ─────────────────────────────────────────
program
  .command("info <server>")
  .description("Get server capabilities")
  .action(async (server) => {
    const res = await api.serverInfo(server);
    if (res.success) {
      console.log(JSON.stringify(res.data, null, 2));
    } else {
      console.error(`Error: ${res.error}`);
    }
  });

// ─── Call Tool ───────────────────────────────────────────
program
  .command("call <server> <tool>")
  .description("Call a tool on an MCP server")
  .option("-i, --input <json>", "Tool input as JSON", "{}")
  .action(async (server, tool, opts) => {
    if (!getApiKey()) {
      console.error("No API key. Run: agentforge auth --key <your_key>");
      process.exit(1);
    }
    let input: Record<string, unknown>;
    try {
      input = JSON.parse(opts.input);
    } catch {
      console.error("Invalid JSON input");
      process.exit(1);
    }
    const res = await api.callTool(server, tool, input);
    console.log(JSON.stringify(res, null, 2));
  });

// ─── Broadcast Search ────────────────────────────────────
program
  .command("search <query>")
  .description("Broadcast search across multiple servers")
  .option("-c, --category <cat>", "Filter by category")
  .option("-n, --max-servers <n>", "Max servers to search", "5")
  .action(async (query, opts) => {
    if (!getApiKey()) {
      console.error("No API key. Run: agentforge auth --key <your_key>");
      process.exit(1);
    }
    const res = await api.broadcastSearch(query, {
      category: opts.category,
      max_servers: parseInt(opts.maxServers),
    });
    if (res.success) {
      const d = res.data as Record<string, unknown>;
      const results = d.results as Array<Record<string, unknown>>;
      console.log(
        `Found ${results.length} servers (${d.response_ms}ms)\n`
      );
      for (const r of results) {
        const srv = r.server as Record<string, unknown>;
        const tools = r.tools as Array<Record<string, unknown>>;
        console.log(`  ${srv.name} (${srv.category})`);
        for (const t of tools) {
          console.log(`    - ${t.name}: ${t.description}`);
        }
        console.log();
      }
    } else {
      console.error(`Error: ${res.error}`);
    }
  });

// ─── Products ────────────────────────────────────────────
program
  .command("products")
  .description("Search products across servers")
  .option("-q, --query <query>", "Search query")
  .option("-c, --category <cat>", "Category filter")
  .option("--max-price <price>", "Maximum price")
  .option("-n, --limit <n>", "Max results", "10")
  .action(async (opts) => {
    const res = await api.searchProducts({
      q: opts.query,
      category: opts.category,
      max_price: opts.maxPrice ? parseFloat(opts.maxPrice) : undefined,
      limit: parseInt(opts.limit),
    });
    if (res.success) {
      const d = res.data as Record<string, unknown>;
      const products = d.products as Array<Record<string, unknown>>;
      if (products.length === 0) {
        console.log("No products found.");
        return;
      }
      for (const p of products) {
        const srv = p.server as Record<string, unknown>;
        const price = p.price ? `${p.price} ${p.currency}` : "N/A";
        console.log(`  ${p.name} — ${price} (${p.freshness})`);
        console.log(`    from: ${srv.name}`);
        if (p.description) console.log(`    ${p.description}`);
        console.log();
      }
    } else {
      console.error(`Error: ${res.error}`);
    }
  });

// ─── Me ──────────────────────────────────────────────────
program
  .command("me")
  .description("Show your agent profile")
  .action(async () => {
    if (!getApiKey()) {
      console.error("No API key. Run: agentforge auth --key <your_key>");
      process.exit(1);
    }
    const res = await api.me();
    if (res.success) {
      console.log(JSON.stringify(res.data, null, 2));
    } else {
      console.error(`Error: ${res.error}`);
    }
  });

// ─── Health ──────────────────────────────────────────────
program
  .command("health")
  .description("Check AgentForge system health")
  .action(async () => {
    const res = await api.health();
    console.log(JSON.stringify(res.success ? res.data : res, null, 2));
  });

program.parse();
