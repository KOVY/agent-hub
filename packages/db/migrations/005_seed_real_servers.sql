-- AgentForge.eu — Seed Data: Real MCP Servers from the Official Ecosystem
-- Replaces KOWEX demo data with actual MCP servers from
-- https://github.com/modelcontextprotocol/servers and popular community servers.
--
-- Migration 005 — 2026-03-10

BEGIN;

-- ============================================================
-- Clean existing seed data
-- ============================================================
DELETE FROM mcp_tools;
DELETE FROM mcp_servers;

-- ============================================================
-- INSERT ALL SERVERS
-- ============================================================

-- 1. Filesystem
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'filesystem',
  'Filesystem',
  'Secure file system operations with configurable access controls — read, write, search, and manage files and directories.',
  'The official MCP Filesystem server provides secure, sandboxed access to the local file system. It exposes tools for reading, writing, moving, and searching files and directories. Access is restricted to explicitly allowed directories, preventing unauthorized file system traversal. Ideal for AI agents that need to work with local files, code repositories, or configuration management.',
  'development',
  'free', 0, 1000,
  9.2, true, true, 4, 284300, 12, 99.99,
  '1.0.0',
  ARRAY['filesystem', 'files', 'directories', 'official', 'reference'],
  'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
  'https://modelcontextprotocol.io/docs/servers/filesystem'
);

-- 2. Brave Search
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'brave-search',
  'Brave Search',
  'Web and local search using the Brave Search API — privacy-focused results with no tracking.',
  'The official Brave Search MCP server enables AI agents to perform web searches and local business lookups using the Brave Search API. It supports both general web search with pagination, filtering, and freshness controls, and local point-of-interest search for finding businesses and places. Brave Search is privacy-first and does not track users, making it ideal for agents that need to search the web without compromising user privacy.',
  'data',
  'freemium', 0, 2000,
  9.0, true, true, 2, 512800, 320, 99.95,
  '1.0.0',
  ARRAY['search', 'web', 'brave', 'privacy', 'official', 'reference'],
  'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search',
  'https://modelcontextprotocol.io/docs/servers/brave-search'
);

-- 3. GitHub
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'github',
  'GitHub',
  'Full GitHub API integration — repositories, issues, pull requests, branches, file operations, and search.',
  'The official GitHub MCP server provides comprehensive access to the GitHub API. Agents can create and manage repositories, work with files via push operations, manage issues and pull requests, handle branches and forks, and perform code and repository searches. It supports both personal access token and GitHub App authentication. Essential for any development workflow that involves code collaboration, CI/CD automation, or repository management.',
  'development',
  'free', 0, 5000,
  9.4, true, true, 4, 891200, 180, 99.97,
  '1.0.0',
  ARRAY['github', 'git', 'repositories', 'issues', 'pull-requests', 'official'],
  'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
  'https://modelcontextprotocol.io/docs/servers/github'
);

-- 4. Slack
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'slack',
  'Slack',
  'Slack workspace integration — send messages, manage channels, read conversation history, and search.',
  'The official Slack MCP server enables AI agents to interact with Slack workspaces. It provides tools for listing channels, reading message history, posting messages, replying to threads, adding reactions, and searching across the workspace. Requires a Slack Bot Token with appropriate OAuth scopes. Commonly used for building notification bots, automating team communication, and integrating AI assistants into Slack workflows.',
  'communication',
  'free', 0, 1000,
  9.1, true, false, 4, 367400, 210, 99.90,
  '1.0.0',
  ARRAY['slack', 'messaging', 'channels', 'teams', 'official'],
  'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
  'https://modelcontextprotocol.io/docs/servers/slack'
);

-- 5. PostgreSQL
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'postgres',
  'PostgreSQL',
  'Read-only PostgreSQL database access — run queries, inspect schemas, and explore database structure safely.',
  'The official PostgreSQL MCP server provides safe, read-only access to PostgreSQL databases. It exposes the database schema as resources for AI agents to understand table structures, and provides a query tool that executes SELECT statements within read-only transactions. This makes it ideal for data exploration, reporting, analytics, and building AI agents that need to answer questions about structured data without risk of data modification.',
  'data',
  'free', 0, 500,
  9.3, true, true, 3, 445600, 45, 99.98,
  '1.0.0',
  ARRAY['postgresql', 'database', 'sql', 'queries', 'official', 'read-only'],
  'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
  'https://modelcontextprotocol.io/docs/servers/postgres'
);

-- 6. SQLite
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'sqlite',
  'SQLite',
  'SQLite database operations — create tables, run queries, analyze data, and manage local databases.',
  'The official SQLite MCP server provides full read-write access to SQLite databases. It includes tools for executing SQL queries, listing tables, describing schema, and appending insights to a memo resource. The built-in analysis workflow allows agents to progressively build understanding of a dataset by writing findings to a memo. Great for local data analysis, prototyping, and lightweight database operations.',
  'data',
  'free', 0, 1000,
  8.8, true, false, 3, 198300, 8, 99.99,
  '1.0.0',
  ARRAY['sqlite', 'database', 'sql', 'local', 'official', 'lightweight'],
  'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite',
  'https://modelcontextprotocol.io/docs/servers/sqlite'
);

-- 7. Puppeteer
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'puppeteer',
  'Puppeteer',
  'Browser automation via Puppeteer — navigate pages, take screenshots, click elements, fill forms, and execute JavaScript.',
  'The official Puppeteer MCP server provides browser automation capabilities through Google Puppeteer. Agents can navigate to URLs, take screenshots of full pages or specific elements, click buttons and links, fill out form fields, select dropdown options, hover over elements, and execute arbitrary JavaScript in the browser console. Supports both headless and headed modes. Ideal for web scraping, automated testing, form submission, and any task requiring browser interaction.',
  'development',
  'free', 0, 500,
  8.9, true, false, 4, 156700, 850, 99.85,
  '1.0.0',
  ARRAY['puppeteer', 'browser', 'automation', 'screenshots', 'scraping', 'official'],
  'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer',
  'https://modelcontextprotocol.io/docs/servers/puppeteer'
);

-- 8. Fetch
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'fetch',
  'Fetch',
  'HTTP fetch and web content extraction — retrieve URLs and convert HTML to readable Markdown.',
  'The official Fetch MCP server enables AI agents to retrieve content from any URL and convert it to a more usable format. It fetches web pages and automatically converts HTML to Markdown for easier consumption by language models, extracts raw text content, or returns the original HTML. Supports custom User-Agent headers, request size limits, and handles redirects. A fundamental building block for agents that need to access web content, APIs, or online documentation.',
  'data',
  'free', 0, 2000,
  9.0, true, false, 2, 623100, 280, 99.92,
  '1.0.0',
  ARRAY['fetch', 'http', 'web', 'scraping', 'markdown', 'official'],
  'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch',
  'https://modelcontextprotocol.io/docs/servers/fetch'
);

-- 9. Memory
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'memory',
  'Memory',
  'Persistent knowledge graph memory — store entities, relations, and observations across conversations.',
  'The official Memory MCP server implements a persistent knowledge graph that allows AI agents to remember information across conversations. It stores entities with typed observations, creates relations between entities, and provides search capabilities. Data is persisted to a local JSON file, making it simple to deploy. Use it to give agents long-term memory about users, projects, preferences, or any structured knowledge that should survive across sessions.',
  'ai',
  'free', 0, 5000,
  9.1, true, true, 4, 342500, 5, 99.99,
  '1.0.0',
  ARRAY['memory', 'knowledge-graph', 'persistence', 'entities', 'official'],
  'https://github.com/modelcontextprotocol/servers/tree/main/src/memory',
  'https://modelcontextprotocol.io/docs/servers/memory'
);

-- 10. Google Maps
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'google-maps',
  'Google Maps',
  'Google Maps Platform integration — geocoding, directions, place search, elevation, and distance calculations.',
  'The official Google Maps MCP server provides access to Google Maps Platform APIs. It supports geocoding and reverse geocoding, route calculation with multiple travel modes, place search and detail retrieval, elevation data, and distance matrix computations. Requires a Google Maps API key. Essential for agents working with location data, travel planning, logistics, or any geospatial task.',
  'data',
  'freemium', 0, 500,
  8.7, true, false, 4, 178900, 230, 99.90,
  '1.0.0',
  ARRAY['google-maps', 'geocoding', 'directions', 'places', 'geospatial', 'official'],
  'https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps',
  'https://modelcontextprotocol.io/docs/servers/google-maps'
);

-- 11. Stripe (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'stripe',
  'Stripe',
  'Stripe payment processing — create charges, manage customers, handle subscriptions, and query payment data.',
  'Community MCP server for Stripe payment integration. Enables AI agents to create and manage customers, process payments, set up subscriptions, generate invoices, handle refunds, and query transaction history. Supports Stripe''s test mode for safe development. Useful for building e-commerce agents, subscription management bots, and financial automation workflows. Requires a Stripe API key with appropriate permissions.',
  'finance',
  'freemium', 9.90, 200,
  7.8, false, true, 4, 89200, 340, 99.80,
  '0.9.0',
  ARRAY['stripe', 'payments', 'subscriptions', 'invoices', 'e-commerce', 'community'],
  'https://github.com/stripe/agent-toolkit',
  'https://docs.stripe.com/agents'
);

-- 12. Notion (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'notion',
  'Notion',
  'Notion workspace integration — search pages, read content, create and update pages, and manage databases.',
  'Community MCP server for interacting with Notion workspaces. Agents can search across all pages and databases, read page content including nested blocks, create new pages with rich content, update existing pages, and query Notion databases with filters and sorts. Supports Notion''s block-based content model including paragraphs, headings, lists, code blocks, and more. Ideal for knowledge management, documentation workflows, and project coordination.',
  'productivity',
  'free', 0, 1000,
  7.5, false, false, 4, 134500, 280, 99.75,
  '1.0.0',
  ARRAY['notion', 'workspace', 'pages', 'databases', 'knowledge-base', 'community'],
  'https://github.com/makenotion/notion-mcp-server',
  'https://developers.notion.com/'
);

-- 13. Discord (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'discord',
  'Discord',
  'Discord bot integration — send messages, manage channels, read history, and handle server events.',
  'Community MCP server for Discord bot operations. Enables AI agents to send messages to channels, read message history, manage channels and roles, respond to threads, add reactions, and handle guild events. Requires a Discord Bot Token with appropriate gateway intents. Useful for community management, automated moderation, notification systems, and interactive AI assistants within Discord servers.',
  'communication',
  'free', 0, 1000,
  6.8, false, false, 3, 67800, 190, 99.70,
  '0.8.0',
  ARRAY['discord', 'bot', 'messaging', 'community', 'chat'],
  'https://github.com/v-3/discordmcp',
  'https://discord.com/developers/docs'
);

-- 14. OpenAI (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'openai',
  'OpenAI',
  'OpenAI API proxy — chat completions, embeddings, image generation (DALL-E), and audio transcription (Whisper).',
  'Community MCP server providing access to OpenAI APIs. Agents can generate text with GPT models, create embeddings for semantic search, generate images with DALL-E, and transcribe audio with Whisper. Supports streaming responses, function calling, and vision capabilities. Useful for building multi-model agent pipelines where Claude orchestrates tasks but delegates specific capabilities like image generation or audio transcription to specialized models.',
  'ai',
  'freemium', 0, 100,
  7.2, false, false, 4, 203100, 1200, 99.85,
  '1.0.0',
  ARRAY['openai', 'gpt', 'dall-e', 'whisper', 'embeddings', 'community'],
  'https://github.com/mzxrai/mcp-openai',
  'https://platform.openai.com/docs'
);

-- 15. Docker (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'docker',
  'Docker',
  'Docker container management — list, create, start, stop, and inspect containers, images, and volumes.',
  'Community MCP server for managing Docker containers and resources. Agents can list running containers, create and start new containers from images, stop and remove containers, inspect container details and logs, manage Docker images and volumes, and execute commands inside running containers. Useful for development environments, CI/CD automation, and infrastructure management tasks where agents need to spin up or manage containerized services.',
  'development',
  'free', 0, 500,
  6.5, false, false, 4, 45600, 95, 99.80,
  '0.7.0',
  ARRAY['docker', 'containers', 'devops', 'infrastructure', 'community'],
  'https://github.com/ckreiling/mcp-server-docker',
  'https://docs.docker.com/'
);

-- 16. Kubernetes (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'kubernetes',
  'Kubernetes',
  'Kubernetes cluster management — pods, deployments, services, and namespace operations via kubectl.',
  'Community MCP server for Kubernetes cluster operations. Agents can list and describe pods, deployments, services, and other resources, apply and delete manifests, scale deployments, view logs from pods, manage namespaces, and execute port-forwarding. Supports kubeconfig-based authentication and multiple cluster contexts. Essential for DevOps agents managing containerized workloads, performing rolling updates, or troubleshooting production issues.',
  'development',
  'free', 0, 300,
  6.2, false, false, 4, 23400, 150, 99.60,
  '0.5.0',
  ARRAY['kubernetes', 'k8s', 'devops', 'containers', 'orchestration', 'community'],
  'https://github.com/strowk/mcp-k8s-go',
  'https://kubernetes.io/docs/'
);

-- 17. AWS (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'aws',
  'AWS',
  'AWS services integration — S3 operations, Lambda invocation, DynamoDB queries, and CloudWatch metrics.',
  'Community MCP server for Amazon Web Services. Provides tool access to common AWS services including S3 (object storage operations), Lambda (function invocation), DynamoDB (NoSQL database queries), CloudWatch (metrics and logs), and STS (identity and credentials). Supports AWS credential profiles and region configuration. Useful for cloud infrastructure automation, data pipeline management, and building agents that interact with AWS-hosted resources.',
  'development',
  'freemium', 0, 200,
  6.8, false, false, 4, 56700, 280, 99.75,
  '0.6.0',
  ARRAY['aws', 's3', 'lambda', 'dynamodb', 'cloud', 'community'],
  'https://github.com/aaronsb/aws-mcp-server',
  'https://docs.aws.amazon.com/'
);

-- 18. Supabase (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'supabase',
  'Supabase',
  'Supabase platform integration — database queries, auth management, storage operations, and edge functions.',
  'Community MCP server for Supabase, the open-source Firebase alternative. Agents can execute SQL queries against the PostgreSQL database, manage authentication users, upload and download files from Supabase Storage, invoke Edge Functions, and manage database migrations. Supports both the Management API (for project administration) and the Data API (for application-level operations). Ideal for agents building or maintaining Supabase-powered applications.',
  'data',
  'free', 0, 500,
  7.6, false, true, 4, 112300, 85, 99.88,
  '1.0.0',
  ARRAY['supabase', 'postgresql', 'auth', 'storage', 'realtime', 'community'],
  'https://github.com/supabase-community/supabase-mcp',
  'https://supabase.com/docs'
);

-- 19. Playwright (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'playwright',
  'Playwright',
  'Browser automation and testing with Playwright — navigate, interact, screenshot, and test across Chromium, Firefox, and WebKit.',
  'Community MCP server built on Microsoft Playwright for cross-browser automation. Agents can navigate web pages, take screenshots, interact with elements via accessibility snapshots (no fragile CSS selectors), fill forms, click buttons, handle dialogs, upload files, and execute JavaScript. Supports Chromium, Firefox, and WebKit browsers. Uses Playwright''s accessibility tree for reliable element targeting. Superior to Puppeteer for complex web interactions and cross-browser testing.',
  'development',
  'free', 0, 500,
  8.2, false, true, 4, 189400, 650, 99.82,
  '1.0.0',
  ARRAY['playwright', 'browser', 'testing', 'automation', 'cross-browser', 'community'],
  'https://github.com/microsoft/playwright-mcp',
  'https://playwright.dev/docs/mcp'
);

-- 20. Anthropic (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'anthropic',
  'Anthropic',
  'Claude API integration — chat completions, vision, tool use, and prompt caching with Anthropic models.',
  'Community MCP server for the Anthropic API. Enables agents to call Claude models for text generation, analyze images with vision capabilities, leverage tool use and function calling, and utilize prompt caching for efficient repeated queries. Supports all Claude model variants including Opus, Sonnet, and Haiku. Useful for multi-agent systems where one agent orchestrates calls to multiple Claude instances with different system prompts or capabilities.',
  'ai',
  'freemium', 0, 100,
  7.9, false, false, 3, 78900, 1100, 99.90,
  '1.0.0',
  ARRAY['anthropic', 'claude', 'ai', 'llm', 'vision', 'community'],
  'https://github.com/anthropics/anthropic-mcp',
  'https://docs.anthropic.com/'
);

-- 21. Vercel (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'vercel',
  'Vercel',
  'Vercel deployment platform — manage projects, trigger deployments, check domains, and view build logs.',
  'Community MCP server for the Vercel deployment platform. Agents can list and manage projects, trigger new deployments, check deployment status and build logs, manage environment variables, configure domains, and view runtime logs. Supports both personal accounts and team contexts. Essential for frontend deployment workflows, CI/CD automation, and agents that manage the full lifecycle of web applications deployed on Vercel.',
  'development',
  'free', 0, 300,
  7.0, false, false, 3, 34500, 320, 99.78,
  '0.8.0',
  ARRAY['vercel', 'deployment', 'hosting', 'frontend', 'serverless', 'community'],
  'https://github.com/vercel/vercel-mcp',
  'https://vercel.com/docs'
);

-- 22. Linear (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'linear',
  'Linear',
  'Linear project management — create and update issues, manage projects, track cycles, and query workspaces.',
  'Community MCP server for Linear, the modern project management tool. Agents can create and update issues, assign team members, manage project roadmaps, track sprint cycles, search across the workspace, and handle issue labels and priorities. Supports Linear''s GraphQL API for efficient data fetching. Ideal for development teams that want AI agents to automate issue triage, sprint planning, or project status reporting.',
  'productivity',
  'free', 0, 500,
  7.4, false, false, 3, 45600, 190, 99.82,
  '1.0.0',
  ARRAY['linear', 'project-management', 'issues', 'sprints', 'agile', 'community'],
  'https://github.com/jerhadf/linear-mcp-server',
  'https://developers.linear.app/docs'
);

-- 23. Sentry (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'sentry',
  'Sentry',
  'Sentry error tracking — query issues, view stack traces, manage releases, and analyze error trends.',
  'Community MCP server for Sentry error monitoring. Agents can list and search issues, retrieve detailed error events with full stack traces, manage releases and deployments, resolve or ignore issues, and analyze error frequency trends. Useful for building automated incident response agents that detect new errors, correlate them with recent deployments, and suggest fixes based on stack trace analysis.',
  'development',
  'freemium', 0, 300,
  7.1, false, false, 3, 28900, 250, 99.80,
  '0.9.0',
  ARRAY['sentry', 'errors', 'monitoring', 'debugging', 'stack-traces', 'community'],
  'https://github.com/getsentry/sentry-mcp',
  'https://docs.sentry.io/'
);

-- 24. Grafana (Community)
INSERT INTO mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, total_calls, avg_response_ms, uptime_percent, version, tags, source_url, documentation_url)
VALUES (
  'grafana',
  'Grafana',
  'Grafana observability — query dashboards, search metrics, list datasources, and investigate alerts.',
  'Community MCP server for Grafana observability platform. Agents can search and retrieve dashboards, query metrics from any configured datasource (Prometheus, InfluxDB, Loki, etc.), list available datasources, investigate active alerts, and explore health status of monitored systems. Essential for building AI-powered operations agents that can monitor infrastructure, diagnose performance issues, and correlate metrics across services.',
  'data',
  'free', 0, 300,
  6.9, false, false, 3, 19800, 180, 99.70,
  '0.7.0',
  ARRAY['grafana', 'monitoring', 'metrics', 'dashboards', 'observability', 'community'],
  'https://github.com/grafana/mcp-grafana',
  'https://grafana.com/docs/'
);

-- ============================================================
-- INSERT ALL TOOLS
-- ============================================================

-- ---- Tools for: filesystem ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'filesystem'),
 'read_file',
 'Read the complete contents of a file from the file system',
 '{"type":"object","properties":{"path":{"type":"string","description":"Absolute or relative path to the file to read"}},"required":["path"]}',
 '{"type":"object","properties":{"content":{"type":"string","description":"The file contents as UTF-8 text"}}}',
 '{"path":"/home/user/project/README.md"}',
 '{"content":"# My Project\n\nA sample project for demonstration."}'
),
((SELECT id FROM mcp_servers WHERE slug = 'filesystem'),
 'write_file',
 'Create or overwrite a file with the given content',
 '{"type":"object","properties":{"path":{"type":"string","description":"Path where the file should be written"},"content":{"type":"string","description":"Content to write to the file"}},"required":["path","content"]}',
 '{"type":"object","properties":{"success":{"type":"boolean"},"bytes_written":{"type":"integer"}}}',
 '{"path":"/home/user/project/output.txt","content":"Hello, World!"}',
 '{"success":true,"bytes_written":13}'
),
((SELECT id FROM mcp_servers WHERE slug = 'filesystem'),
 'list_directory',
 'List files and directories at the given path',
 '{"type":"object","properties":{"path":{"type":"string","description":"Directory path to list"}},"required":["path"]}',
 '{"type":"object","properties":{"entries":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"type":{"type":"string","enum":["file","directory"]},"size":{"type":"integer"}}}}}}',
 '{"path":"/home/user/project"}',
 '{"entries":[{"name":"src","type":"directory","size":0},{"name":"README.md","type":"file","size":256},{"name":"package.json","type":"file","size":1024}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'filesystem'),
 'search_files',
 'Recursively search for files matching a pattern',
 '{"type":"object","properties":{"path":{"type":"string","description":"Starting directory for the search"},"pattern":{"type":"string","description":"Glob pattern to match file names"},"excludePatterns":{"type":"array","items":{"type":"string"},"description":"Patterns to exclude from search"}},"required":["path","pattern"]}',
 '{"type":"object","properties":{"matches":{"type":"array","items":{"type":"string","description":"Absolute paths of matching files"}}}}',
 '{"path":"/home/user/project","pattern":"*.ts","excludePatterns":["node_modules"]}',
 '{"matches":["/home/user/project/src/index.ts","/home/user/project/src/utils.ts"]}'
);

-- ---- Tools for: brave-search ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'brave-search'),
 'brave_web_search',
 'Perform a web search using the Brave Search API with pagination and freshness controls',
 '{"type":"object","properties":{"query":{"type":"string","description":"Search query string"},"count":{"type":"integer","description":"Number of results (1-20, default 10)"},"offset":{"type":"integer","description":"Pagination offset"},"freshness":{"type":"string","enum":["pd","pw","pm","py"],"description":"Freshness filter: past day/week/month/year"}},"required":["query"]}',
 '{"type":"object","properties":{"results":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string"},"url":{"type":"string"},"description":{"type":"string"}}}}}}',
 '{"query":"Model Context Protocol servers","count":5}',
 '{"results":[{"title":"MCP Servers - Official Repository","url":"https://github.com/modelcontextprotocol/servers","description":"Reference implementations and community servers for the Model Context Protocol."}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'brave-search'),
 'brave_local_search',
 'Search for local businesses and places using Brave Local Search',
 '{"type":"object","properties":{"query":{"type":"string","description":"Local search query (e.g. pizza near me)"},"count":{"type":"integer","description":"Number of results (1-20)"}},"required":["query"]}',
 '{"type":"object","properties":{"results":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"address":{"type":"string"},"phone":{"type":"string"},"rating":{"type":"number"}}}}}}',
 '{"query":"coffee shops in San Francisco","count":3}',
 '{"results":[{"name":"Blue Bottle Coffee","address":"66 Mint St, San Francisco, CA","phone":"+1-510-653-3394","rating":4.5}]}'
);

-- ---- Tools for: github ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'github'),
 'create_or_update_file',
 'Create or update a single file in a GitHub repository',
 '{"type":"object","properties":{"owner":{"type":"string","description":"Repository owner"},"repo":{"type":"string","description":"Repository name"},"path":{"type":"string","description":"File path within the repository"},"content":{"type":"string","description":"File content"},"message":{"type":"string","description":"Commit message"},"branch":{"type":"string","description":"Branch name"}},"required":["owner","repo","path","content","message"]}',
 '{"type":"object","properties":{"commit_sha":{"type":"string"},"content":{"type":"object","properties":{"path":{"type":"string"},"sha":{"type":"string"}}}}}',
 '{"owner":"octocat","repo":"hello-world","path":"README.md","content":"# Hello World","message":"Update README","branch":"main"}',
 '{"commit_sha":"abc123def456","content":{"path":"README.md","sha":"def789"}}'
),
((SELECT id FROM mcp_servers WHERE slug = 'github'),
 'search_repositories',
 'Search for GitHub repositories matching a query',
 '{"type":"object","properties":{"query":{"type":"string","description":"Search query using GitHub search syntax"},"page":{"type":"integer","default":1},"perPage":{"type":"integer","default":30}},"required":["query"]}',
 '{"type":"object","properties":{"total_count":{"type":"integer"},"items":{"type":"array","items":{"type":"object","properties":{"full_name":{"type":"string"},"description":{"type":"string"},"stars":{"type":"integer"},"language":{"type":"string"}}}}}}',
 '{"query":"mcp server language:typescript","perPage":5}',
 '{"total_count":142,"items":[{"full_name":"modelcontextprotocol/servers","description":"MCP Servers","stars":15200,"language":"TypeScript"}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'github'),
 'create_issue',
 'Create a new issue in a GitHub repository',
 '{"type":"object","properties":{"owner":{"type":"string"},"repo":{"type":"string"},"title":{"type":"string","description":"Issue title"},"body":{"type":"string","description":"Issue body in Markdown"},"labels":{"type":"array","items":{"type":"string"}},"assignees":{"type":"array","items":{"type":"string"}}},"required":["owner","repo","title"]}',
 '{"type":"object","properties":{"number":{"type":"integer"},"html_url":{"type":"string"},"state":{"type":"string"}}}',
 '{"owner":"octocat","repo":"hello-world","title":"Bug: Login fails on mobile","body":"## Steps to reproduce\n1. Open app on mobile\n2. Tap login\n3. Nothing happens","labels":["bug"]}',
 '{"number":42,"html_url":"https://github.com/octocat/hello-world/issues/42","state":"open"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'github'),
 'create_pull_request',
 'Create a new pull request in a GitHub repository',
 '{"type":"object","properties":{"owner":{"type":"string"},"repo":{"type":"string"},"title":{"type":"string","description":"PR title"},"body":{"type":"string","description":"PR description"},"head":{"type":"string","description":"Branch with changes"},"base":{"type":"string","description":"Branch to merge into"}},"required":["owner","repo","title","head","base"]}',
 '{"type":"object","properties":{"number":{"type":"integer"},"html_url":{"type":"string"},"state":{"type":"string"},"mergeable":{"type":"boolean"}}}',
 '{"owner":"octocat","repo":"hello-world","title":"feat: add dark mode","body":"Implements dark mode theme","head":"feature/dark-mode","base":"main"}',
 '{"number":15,"html_url":"https://github.com/octocat/hello-world/pull/15","state":"open","mergeable":true}'
);

-- ---- Tools for: slack ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'slack'),
 'list_channels',
 'List all public channels in the Slack workspace',
 '{"type":"object","properties":{"limit":{"type":"integer","default":100},"cursor":{"type":"string","description":"Pagination cursor"}},"required":[]}',
 '{"type":"object","properties":{"channels":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"topic":{"type":"string"},"num_members":{"type":"integer"}}}}}}',
 '{"limit":10}',
 '{"channels":[{"id":"C01ABC","name":"general","topic":"Company-wide announcements","num_members":150},{"id":"C02DEF","name":"engineering","topic":"Engineering discussions","num_members":45}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'slack'),
 'post_message',
 'Send a message to a Slack channel',
 '{"type":"object","properties":{"channel":{"type":"string","description":"Channel ID or name"},"text":{"type":"string","description":"Message text (supports Slack mrkdwn)"}},"required":["channel","text"]}',
 '{"type":"object","properties":{"ok":{"type":"boolean"},"ts":{"type":"string","description":"Message timestamp (ID)"},"channel":{"type":"string"}}}',
 '{"channel":"C01ABC","text":"Deployment to production completed successfully :rocket:"}',
 '{"ok":true,"ts":"1678901234.567890","channel":"C01ABC"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'slack'),
 'get_channel_history',
 'Retrieve recent messages from a Slack channel',
 '{"type":"object","properties":{"channel_id":{"type":"string","description":"Channel ID"},"limit":{"type":"integer","default":10}},"required":["channel_id"]}',
 '{"type":"object","properties":{"messages":{"type":"array","items":{"type":"object","properties":{"user":{"type":"string"},"text":{"type":"string"},"ts":{"type":"string"}}}}}}',
 '{"channel_id":"C01ABC","limit":5}',
 '{"messages":[{"user":"U01XYZ","text":"Has anyone tested the new API endpoint?","ts":"1678901234.567890"}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'slack'),
 'search_messages',
 'Search for messages across the Slack workspace',
 '{"type":"object","properties":{"query":{"type":"string","description":"Search query"},"count":{"type":"integer","default":20}},"required":["query"]}',
 '{"type":"object","properties":{"total":{"type":"integer"},"matches":{"type":"array","items":{"type":"object","properties":{"text":{"type":"string"},"channel":{"type":"string"},"user":{"type":"string"},"ts":{"type":"string"}}}}}}',
 '{"query":"deployment error","count":5}',
 '{"total":12,"matches":[{"text":"We had a deployment error in staging last night","channel":"engineering","user":"U01XYZ","ts":"1678901234.567890"}]}'
);

-- ---- Tools for: postgres ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'postgres'),
 'query',
 'Execute a read-only SQL query against the PostgreSQL database',
 '{"type":"object","properties":{"sql":{"type":"string","description":"SQL SELECT query to execute"}},"required":["sql"]}',
 '{"type":"object","properties":{"rows":{"type":"array","items":{"type":"object"}},"rowCount":{"type":"integer"},"fields":{"type":"array","items":{"type":"string"}}}}',
 '{"sql":"SELECT id, name, email FROM users WHERE created_at > ''2026-01-01'' LIMIT 10"}',
 '{"rows":[{"id":1,"name":"Alice","email":"alice@example.com"}],"rowCount":1,"fields":["id","name","email"]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'postgres'),
 'describe_table',
 'Get the schema definition of a specific table',
 '{"type":"object","properties":{"table_name":{"type":"string","description":"Name of the table to describe"},"schema":{"type":"string","default":"public","description":"Database schema"}},"required":["table_name"]}',
 '{"type":"object","properties":{"columns":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"type":{"type":"string"},"nullable":{"type":"boolean"},"default":{"type":"string"}}}}}}',
 '{"table_name":"users","schema":"public"}',
 '{"columns":[{"name":"id","type":"uuid","nullable":false,"default":"uuid_generate_v4()"},{"name":"email","type":"varchar(255)","nullable":false,"default":null}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'postgres'),
 'list_tables',
 'List all tables in the specified schema',
 '{"type":"object","properties":{"schema":{"type":"string","default":"public","description":"Database schema to list tables from"}},"required":[]}',
 '{"type":"object","properties":{"tables":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"row_count":{"type":"integer"},"size":{"type":"string"}}}}}}',
 '{"schema":"public"}',
 '{"tables":[{"name":"users","row_count":15420,"size":"2.1 MB"},{"name":"orders","row_count":89200,"size":"12.4 MB"}]}'
);

-- ---- Tools for: sqlite ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'sqlite'),
 'read_query',
 'Execute a SELECT query on the SQLite database',
 '{"type":"object","properties":{"query":{"type":"string","description":"SELECT SQL query to execute"}},"required":["query"]}',
 '{"type":"object","properties":{"rows":{"type":"array","items":{"type":"object"}},"columns":{"type":"array","items":{"type":"string"}}}}',
 '{"query":"SELECT name, population FROM cities ORDER BY population DESC LIMIT 5"}',
 '{"rows":[{"name":"Tokyo","population":13960000},{"name":"Delhi","population":11030000}],"columns":["name","population"]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'sqlite'),
 'write_query',
 'Execute an INSERT, UPDATE, or DELETE query on the SQLite database',
 '{"type":"object","properties":{"query":{"type":"string","description":"SQL write query to execute"}},"required":["query"]}',
 '{"type":"object","properties":{"changes":{"type":"integer","description":"Number of rows affected"},"lastInsertRowid":{"type":"integer"}}}',
 '{"query":"INSERT INTO notes (title, content) VALUES (''Meeting notes'', ''Discussed Q2 roadmap'')"}',
 '{"changes":1,"lastInsertRowid":42}'
),
((SELECT id FROM mcp_servers WHERE slug = 'sqlite'),
 'list_tables',
 'List all tables in the SQLite database',
 '{"type":"object","properties":{},"required":[]}',
 '{"type":"object","properties":{"tables":{"type":"array","items":{"type":"string"}}}}',
 '{}',
 '{"tables":["users","orders","products","notes"]}'
);

-- ---- Tools for: puppeteer ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'puppeteer'),
 'navigate',
 'Navigate the browser to a URL',
 '{"type":"object","properties":{"url":{"type":"string","description":"URL to navigate to"},"waitUntil":{"type":"string","enum":["load","domcontentloaded","networkidle0","networkidle2"],"default":"networkidle2"}},"required":["url"]}',
 '{"type":"object","properties":{"title":{"type":"string"},"url":{"type":"string"},"status":{"type":"integer"}}}',
 '{"url":"https://example.com","waitUntil":"networkidle2"}',
 '{"title":"Example Domain","url":"https://example.com/","status":200}'
),
((SELECT id FROM mcp_servers WHERE slug = 'puppeteer'),
 'screenshot',
 'Take a screenshot of the current page or a specific element',
 '{"type":"object","properties":{"name":{"type":"string","description":"Name for the screenshot"},"selector":{"type":"string","description":"CSS selector of element to capture (optional)"},"fullPage":{"type":"boolean","default":false}},"required":["name"]}',
 '{"type":"object","properties":{"imageData":{"type":"string","description":"Base64-encoded PNG image"},"width":{"type":"integer"},"height":{"type":"integer"}}}',
 '{"name":"homepage","fullPage":true}',
 '{"imageData":"iVBORw0KGgo...","width":1280,"height":3200}'
),
((SELECT id FROM mcp_servers WHERE slug = 'puppeteer'),
 'click',
 'Click an element on the page using a CSS selector',
 '{"type":"object","properties":{"selector":{"type":"string","description":"CSS selector of the element to click"}},"required":["selector"]}',
 '{"type":"object","properties":{"success":{"type":"boolean"},"elementText":{"type":"string"}}}',
 '{"selector":"button.submit"}',
 '{"success":true,"elementText":"Submit"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'puppeteer'),
 'evaluate',
 'Execute JavaScript in the browser console and return the result',
 '{"type":"object","properties":{"script":{"type":"string","description":"JavaScript code to execute in the browser"}},"required":["script"]}',
 '{"type":"object","properties":{"result":{"description":"Return value of the script"}}}',
 '{"script":"document.querySelectorAll(''a'').length"}',
 '{"result":42}'
);

-- ---- Tools for: fetch ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'fetch'),
 'fetch',
 'Fetch a URL and return content as Markdown, text, or raw HTML',
 '{"type":"object","properties":{"url":{"type":"string","description":"URL to fetch"},"method":{"type":"string","enum":["GET","POST","PUT","DELETE"],"default":"GET"},"headers":{"type":"object","description":"Request headers"},"body":{"type":"string","description":"Request body for POST/PUT"},"maxLength":{"type":"integer","default":50000,"description":"Maximum response length in characters"}},"required":["url"]}',
 '{"type":"object","properties":{"content":{"type":"string","description":"Response content (Markdown for HTML pages)"},"mimeType":{"type":"string"},"status":{"type":"integer"}}}',
 '{"url":"https://example.com","method":"GET"}',
 '{"content":"# Example Domain\n\nThis domain is for use in illustrative examples.","mimeType":"text/html","status":200}'
),
((SELECT id FROM mcp_servers WHERE slug = 'fetch'),
 'fetch_raw',
 'Fetch a URL and return the raw response without conversion',
 '{"type":"object","properties":{"url":{"type":"string","description":"URL to fetch"},"method":{"type":"string","enum":["GET","POST","PUT","DELETE"],"default":"GET"},"headers":{"type":"object"},"body":{"type":"string"}},"required":["url"]}',
 '{"type":"object","properties":{"content":{"type":"string"},"mimeType":{"type":"string"},"status":{"type":"integer"},"headers":{"type":"object"}}}',
 '{"url":"https://api.example.com/data.json"}',
 '{"content":"{\"status\":\"ok\",\"data\":[]}","mimeType":"application/json","status":200,"headers":{"content-type":"application/json"}}'
);

-- ---- Tools for: memory ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'memory'),
 'create_entities',
 'Create new entities in the knowledge graph with typed observations',
 '{"type":"object","properties":{"entities":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string","description":"Unique entity name"},"entityType":{"type":"string","description":"Entity type (e.g. person, project, concept)"},"observations":{"type":"array","items":{"type":"string"}}}}}},"required":["entities"]}',
 '{"type":"object","properties":{"created":{"type":"array","items":{"type":"string"}}}}',
 '{"entities":[{"name":"Alice","entityType":"person","observations":["Works at Acme Corp","Prefers dark mode","Expert in Python"]}]}',
 '{"created":["Alice"]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'memory'),
 'create_relations',
 'Create relations between existing entities in the knowledge graph',
 '{"type":"object","properties":{"relations":{"type":"array","items":{"type":"object","properties":{"from":{"type":"string"},"to":{"type":"string"},"relationType":{"type":"string"}}}}},"required":["relations"]}',
 '{"type":"object","properties":{"created":{"type":"integer"}}}',
 '{"relations":[{"from":"Alice","to":"Project Alpha","relationType":"works_on"}]}',
 '{"created":1}'
),
((SELECT id FROM mcp_servers WHERE slug = 'memory'),
 'search_nodes',
 'Search for entities in the knowledge graph by name or observation content',
 '{"type":"object","properties":{"query":{"type":"string","description":"Search query to match against entity names and observations"}},"required":["query"]}',
 '{"type":"object","properties":{"entities":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"entityType":{"type":"string"},"observations":{"type":"array","items":{"type":"string"}}}}}}}',
 '{"query":"Python expert"}',
 '{"entities":[{"name":"Alice","entityType":"person","observations":["Works at Acme Corp","Prefers dark mode","Expert in Python"]}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'memory'),
 'open_nodes',
 'Retrieve specific entities by their exact names',
 '{"type":"object","properties":{"names":{"type":"array","items":{"type":"string","description":"Entity names to retrieve"}}},"required":["names"]}',
 '{"type":"object","properties":{"entities":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"entityType":{"type":"string"},"observations":{"type":"array","items":{"type":"string"}}}}}}}',
 '{"names":["Alice","Project Alpha"]}',
 '{"entities":[{"name":"Alice","entityType":"person","observations":["Works at Acme Corp"]},{"name":"Project Alpha","entityType":"project","observations":["Started 2026-01"]}]}'
);

-- ---- Tools for: google-maps ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'google-maps'),
 'geocode',
 'Convert an address to geographic coordinates (latitude/longitude)',
 '{"type":"object","properties":{"address":{"type":"string","description":"Address to geocode"}},"required":["address"]}',
 '{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"},"formatted_address":{"type":"string"},"place_id":{"type":"string"}}}',
 '{"address":"1600 Amphitheatre Parkway, Mountain View, CA"}',
 '{"lat":37.4224764,"lng":-122.0842499,"formatted_address":"1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA","place_id":"ChIJ2eUgeAK6j4ARbn5u_wAGqWA"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'google-maps'),
 'get_directions',
 'Get directions between two locations with route details',
 '{"type":"object","properties":{"origin":{"type":"string","description":"Starting point address or coordinates"},"destination":{"type":"string","description":"Destination address or coordinates"},"mode":{"type":"string","enum":["driving","walking","bicycling","transit"],"default":"driving"}},"required":["origin","destination"]}',
 '{"type":"object","properties":{"distance":{"type":"string"},"duration":{"type":"string"},"steps":{"type":"array","items":{"type":"object","properties":{"instruction":{"type":"string"},"distance":{"type":"string"}}}}}}',
 '{"origin":"Prague, Czech Republic","destination":"Brno, Czech Republic","mode":"driving"}',
 '{"distance":"205 km","duration":"2 hours 10 min","steps":[{"instruction":"Head southeast on D1","distance":"195 km"}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'google-maps'),
 'search_places',
 'Search for places near a location',
 '{"type":"object","properties":{"query":{"type":"string","description":"Search query (e.g. restaurants)"},"location":{"type":"string","description":"Center point for the search"},"radius":{"type":"integer","default":5000,"description":"Search radius in meters"}},"required":["query","location"]}',
 '{"type":"object","properties":{"results":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"address":{"type":"string"},"rating":{"type":"number"},"price_level":{"type":"integer"}}}}}}',
 '{"query":"coworking spaces","location":"Prague","radius":3000}',
 '{"results":[{"name":"Impact Hub Prague","address":"Drtinova 10, Praha 5","rating":4.6,"price_level":2}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'google-maps'),
 'distance_matrix',
 'Calculate travel distance and time between multiple origins and destinations',
 '{"type":"object","properties":{"origins":{"type":"array","items":{"type":"string"}},"destinations":{"type":"array","items":{"type":"string"}},"mode":{"type":"string","enum":["driving","walking","bicycling","transit"],"default":"driving"}},"required":["origins","destinations"]}',
 '{"type":"object","properties":{"rows":{"type":"array","items":{"type":"object","properties":{"elements":{"type":"array","items":{"type":"object","properties":{"distance":{"type":"string"},"duration":{"type":"string"}}}}}}}}}',
 '{"origins":["Prague","Brno"],"destinations":["Vienna","Bratislava"]}',
 '{"rows":[{"elements":[{"distance":"334 km","duration":"3h 30m"},{"distance":"330 km","duration":"3h 25m"}]},{"elements":[{"distance":"143 km","duration":"1h 50m"},{"distance":"130 km","duration":"1h 30m"}]}]}'
);

-- ---- Tools for: stripe ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'stripe'),
 'create_customer',
 'Create a new customer in Stripe',
 '{"type":"object","properties":{"email":{"type":"string","description":"Customer email address"},"name":{"type":"string","description":"Customer full name"},"metadata":{"type":"object","description":"Additional key-value metadata"}},"required":["email"]}',
 '{"type":"object","properties":{"id":{"type":"string"},"email":{"type":"string"},"created":{"type":"integer"}}}',
 '{"email":"alice@example.com","name":"Alice Smith","metadata":{"plan":"pro"}}',
 '{"id":"cus_OaBC123","email":"alice@example.com","created":1709836800}'
),
((SELECT id FROM mcp_servers WHERE slug = 'stripe'),
 'create_payment_intent',
 'Create a payment intent for processing a charge',
 '{"type":"object","properties":{"amount":{"type":"integer","description":"Amount in smallest currency unit (e.g. cents)"},"currency":{"type":"string","default":"usd","description":"Three-letter ISO currency code"},"customer":{"type":"string","description":"Stripe customer ID"},"description":{"type":"string"}},"required":["amount","currency"]}',
 '{"type":"object","properties":{"id":{"type":"string"},"client_secret":{"type":"string"},"status":{"type":"string"},"amount":{"type":"integer"}}}',
 '{"amount":2000,"currency":"eur","customer":"cus_OaBC123","description":"Pro plan monthly"}',
 '{"id":"pi_3OaBC456","client_secret":"pi_3OaBC456_secret_xyz","status":"requires_payment_method","amount":2000}'
),
((SELECT id FROM mcp_servers WHERE slug = 'stripe'),
 'list_charges',
 'List recent charges with optional customer filter',
 '{"type":"object","properties":{"customer":{"type":"string","description":"Filter by Stripe customer ID"},"limit":{"type":"integer","default":10},"starting_after":{"type":"string","description":"Cursor for pagination"}},"required":[]}',
 '{"type":"object","properties":{"data":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"amount":{"type":"integer"},"currency":{"type":"string"},"status":{"type":"string"},"created":{"type":"integer"}}}},"has_more":{"type":"boolean"}}}',
 '{"customer":"cus_OaBC123","limit":5}',
 '{"data":[{"id":"ch_3OaBC789","amount":2000,"currency":"eur","status":"succeeded","created":1709836800}],"has_more":false}'
),
((SELECT id FROM mcp_servers WHERE slug = 'stripe'),
 'create_subscription',
 'Create a recurring subscription for a customer',
 '{"type":"object","properties":{"customer":{"type":"string","description":"Stripe customer ID"},"price":{"type":"string","description":"Stripe price ID"},"trial_period_days":{"type":"integer"}},"required":["customer","price"]}',
 '{"type":"object","properties":{"id":{"type":"string"},"status":{"type":"string"},"current_period_start":{"type":"integer"},"current_period_end":{"type":"integer"}}}',
 '{"customer":"cus_OaBC123","price":"price_pro_monthly","trial_period_days":14}',
 '{"id":"sub_OaBC012","status":"trialing","current_period_start":1709836800,"current_period_end":1712515200}'
);

-- ---- Tools for: notion ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'notion'),
 'search',
 'Search across all pages and databases in the Notion workspace',
 '{"type":"object","properties":{"query":{"type":"string","description":"Search query text"},"filter":{"type":"object","properties":{"property":{"type":"string","enum":["object"]},"value":{"type":"string","enum":["page","database"]}}}},"required":["query"]}',
 '{"type":"object","properties":{"results":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"type":{"type":"string"},"url":{"type":"string"}}}}}}',
 '{"query":"project roadmap","filter":{"property":"object","value":"page"}}',
 '{"results":[{"id":"abc-123","title":"Q2 Project Roadmap","type":"page","url":"https://notion.so/Q2-Project-Roadmap-abc123"}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'notion'),
 'get_page',
 'Retrieve the content of a Notion page including all blocks',
 '{"type":"object","properties":{"page_id":{"type":"string","description":"Notion page ID"}},"required":["page_id"]}',
 '{"type":"object","properties":{"title":{"type":"string"},"content":{"type":"array","items":{"type":"object","properties":{"type":{"type":"string"},"text":{"type":"string"}}}},"properties":{"type":"object"}}}',
 '{"page_id":"abc-123"}',
 '{"title":"Q2 Project Roadmap","content":[{"type":"heading_1","text":"Goals"},{"type":"paragraph","text":"Ship v2.0 by end of Q2"}],"properties":{"status":"In Progress"}}'
),
((SELECT id FROM mcp_servers WHERE slug = 'notion'),
 'create_page',
 'Create a new page in a Notion database or as a child of another page',
 '{"type":"object","properties":{"parent_id":{"type":"string","description":"Parent page or database ID"},"title":{"type":"string","description":"Page title"},"properties":{"type":"object","description":"Database properties to set"},"content":{"type":"array","items":{"type":"object","properties":{"type":{"type":"string"},"text":{"type":"string"}}}}},"required":["parent_id","title"]}',
 '{"type":"object","properties":{"id":{"type":"string"},"url":{"type":"string"}}}',
 '{"parent_id":"db-456","title":"New Feature Spec","properties":{"Status":"Draft","Priority":"High"},"content":[{"type":"paragraph","text":"This document outlines the new feature."}]}',
 '{"id":"def-789","url":"https://notion.so/New-Feature-Spec-def789"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'notion'),
 'update_page',
 'Update properties or content of an existing Notion page',
 '{"type":"object","properties":{"page_id":{"type":"string","description":"Notion page ID to update"},"properties":{"type":"object","description":"Properties to update"},"content":{"type":"array","items":{"type":"object"},"description":"New content blocks to append"}},"required":["page_id"]}',
 '{"type":"object","properties":{"id":{"type":"string"},"last_edited_time":{"type":"string"}}}',
 '{"page_id":"def-789","properties":{"Status":"In Review"}}',
 '{"id":"def-789","last_edited_time":"2026-03-10T14:30:00.000Z"}'
);

-- ---- Tools for: discord ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'discord'),
 'send_message',
 'Send a message to a Discord channel',
 '{"type":"object","properties":{"channel_id":{"type":"string","description":"Discord channel ID"},"content":{"type":"string","description":"Message content"},"embed":{"type":"object","description":"Optional embed object"}},"required":["channel_id","content"]}',
 '{"type":"object","properties":{"id":{"type":"string"},"channel_id":{"type":"string"},"timestamp":{"type":"string"}}}',
 '{"channel_id":"123456789","content":"Build completed successfully!"}',
 '{"id":"987654321","channel_id":"123456789","timestamp":"2026-03-10T12:00:00.000Z"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'discord'),
 'get_messages',
 'Retrieve recent messages from a Discord channel',
 '{"type":"object","properties":{"channel_id":{"type":"string","description":"Discord channel ID"},"limit":{"type":"integer","default":50,"description":"Number of messages to retrieve (1-100)"}},"required":["channel_id"]}',
 '{"type":"object","properties":{"messages":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"author":{"type":"string"},"content":{"type":"string"},"timestamp":{"type":"string"}}}}}}',
 '{"channel_id":"123456789","limit":10}',
 '{"messages":[{"id":"111","author":"devbot","content":"Deployment started","timestamp":"2026-03-10T11:55:00.000Z"}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'discord'),
 'list_channels',
 'List all channels in a Discord guild (server)',
 '{"type":"object","properties":{"guild_id":{"type":"string","description":"Discord guild/server ID"}},"required":["guild_id"]}',
 '{"type":"object","properties":{"channels":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"type":{"type":"string"}}}}}}',
 '{"guild_id":"999888777"}',
 '{"channels":[{"id":"123456789","name":"general","type":"text"},{"id":"123456790","name":"dev","type":"text"}]}'
);

-- ---- Tools for: openai ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'openai'),
 'chat_completion',
 'Generate a chat completion using an OpenAI GPT model',
 '{"type":"object","properties":{"model":{"type":"string","default":"gpt-4o","description":"Model ID to use"},"messages":{"type":"array","items":{"type":"object","properties":{"role":{"type":"string","enum":["system","user","assistant"]},"content":{"type":"string"}}}},"temperature":{"type":"number","default":0.7},"max_tokens":{"type":"integer"}},"required":["messages"]}',
 '{"type":"object","properties":{"content":{"type":"string"},"model":{"type":"string"},"usage":{"type":"object","properties":{"prompt_tokens":{"type":"integer"},"completion_tokens":{"type":"integer"}}}}}',
 '{"model":"gpt-4o","messages":[{"role":"user","content":"Summarize MCP in one sentence."}],"temperature":0.3}',
 '{"content":"The Model Context Protocol (MCP) is an open standard for connecting AI assistants to external data sources and tools.","model":"gpt-4o","usage":{"prompt_tokens":15,"completion_tokens":24}}'
),
((SELECT id FROM mcp_servers WHERE slug = 'openai'),
 'create_embedding',
 'Generate vector embeddings for text using OpenAI embedding models',
 '{"type":"object","properties":{"input":{"type":"string","description":"Text to generate embeddings for"},"model":{"type":"string","default":"text-embedding-3-small"}},"required":["input"]}',
 '{"type":"object","properties":{"embedding":{"type":"array","items":{"type":"number"}},"dimensions":{"type":"integer"}}}',
 '{"input":"Model Context Protocol","model":"text-embedding-3-small"}',
 '{"embedding":[0.0123,-0.0456,0.0789],"dimensions":1536}'
),
((SELECT id FROM mcp_servers WHERE slug = 'openai'),
 'generate_image',
 'Generate an image using DALL-E',
 '{"type":"object","properties":{"prompt":{"type":"string","description":"Text description of the image to generate"},"model":{"type":"string","default":"dall-e-3"},"size":{"type":"string","enum":["1024x1024","1024x1792","1792x1024"],"default":"1024x1024"},"quality":{"type":"string","enum":["standard","hd"],"default":"standard"}},"required":["prompt"]}',
 '{"type":"object","properties":{"url":{"type":"string"},"revised_prompt":{"type":"string"}}}',
 '{"prompt":"A futuristic AI marketplace with glowing server racks","size":"1024x1024","quality":"hd"}',
 '{"url":"https://oaidalleapiprodscus.blob.core.windows.net/...","revised_prompt":"A futuristic AI marketplace hall..."}'
),
((SELECT id FROM mcp_servers WHERE slug = 'openai'),
 'transcribe_audio',
 'Transcribe audio to text using Whisper',
 '{"type":"object","properties":{"audio":{"type":"string","description":"Base64-encoded audio data"},"language":{"type":"string","description":"ISO-639-1 language code"},"response_format":{"type":"string","enum":["json","text","srt","vtt"],"default":"json"}},"required":["audio"]}',
 '{"type":"object","properties":{"text":{"type":"string"},"language":{"type":"string"},"duration":{"type":"number"}}}',
 '{"audio":"UklGRi...","language":"en","response_format":"json"}',
 '{"text":"Hello and welcome to the meeting.","language":"en","duration":3.2}'
);

-- ---- Tools for: docker ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'docker'),
 'list_containers',
 'List Docker containers with optional status filter',
 '{"type":"object","properties":{"all":{"type":"boolean","default":false,"description":"Show all containers (including stopped)"},"filters":{"type":"object","description":"Filter containers (e.g. status, name)"}},"required":[]}',
 '{"type":"object","properties":{"containers":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"image":{"type":"string"},"status":{"type":"string"},"ports":{"type":"array"}}}}}}',
 '{"all":false}',
 '{"containers":[{"id":"abc123","name":"web-app","image":"node:20","status":"running","ports":["0.0.0.0:3000->3000/tcp"]}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'docker'),
 'create_container',
 'Create and optionally start a new Docker container',
 '{"type":"object","properties":{"image":{"type":"string","description":"Docker image to use"},"name":{"type":"string","description":"Container name"},"ports":{"type":"object","description":"Port mappings (container:host)"},"env":{"type":"array","items":{"type":"string"},"description":"Environment variables"},"start":{"type":"boolean","default":true}},"required":["image"]}',
 '{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"status":{"type":"string"}}}',
 '{"image":"postgres:16","name":"my-db","ports":{"5432":"5432"},"env":["POSTGRES_PASSWORD=secret"],"start":true}',
 '{"id":"def456","name":"my-db","status":"running"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'docker'),
 'container_logs',
 'Retrieve logs from a Docker container',
 '{"type":"object","properties":{"container":{"type":"string","description":"Container ID or name"},"tail":{"type":"integer","default":100,"description":"Number of lines from the end"},"since":{"type":"string","description":"Show logs since timestamp"}},"required":["container"]}',
 '{"type":"object","properties":{"logs":{"type":"string"}}}',
 '{"container":"my-db","tail":20}',
 '{"logs":"2026-03-10 12:00:00.000 UTC [1] LOG:  database system is ready to accept connections"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'docker'),
 'exec_command',
 'Execute a command inside a running Docker container',
 '{"type":"object","properties":{"container":{"type":"string","description":"Container ID or name"},"command":{"type":"array","items":{"type":"string"},"description":"Command and arguments to execute"}},"required":["container","command"]}',
 '{"type":"object","properties":{"exit_code":{"type":"integer"},"stdout":{"type":"string"},"stderr":{"type":"string"}}}',
 '{"container":"my-db","command":["psql","-U","postgres","-c","SELECT version();"]}',
 '{"exit_code":0,"stdout":"PostgreSQL 16.2 on x86_64-pc-linux-gnu","stderr":""}'
);

-- ---- Tools for: kubernetes ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'kubernetes'),
 'get_pods',
 'List pods in a Kubernetes namespace with status details',
 '{"type":"object","properties":{"namespace":{"type":"string","default":"default","description":"Kubernetes namespace"},"labelSelector":{"type":"string","description":"Label selector (e.g. app=web)"}},"required":[]}',
 '{"type":"object","properties":{"pods":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"namespace":{"type":"string"},"status":{"type":"string"},"restarts":{"type":"integer"},"age":{"type":"string"}}}}}}',
 '{"namespace":"production","labelSelector":"app=api"}',
 '{"pods":[{"name":"api-7d9b8c6f4-x2k9p","namespace":"production","status":"Running","restarts":0,"age":"3d"}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'kubernetes'),
 'apply_manifest',
 'Apply a Kubernetes manifest (YAML/JSON) to the cluster',
 '{"type":"object","properties":{"manifest":{"type":"string","description":"YAML or JSON manifest content"},"namespace":{"type":"string","default":"default"}},"required":["manifest"]}',
 '{"type":"object","properties":{"kind":{"type":"string"},"name":{"type":"string"},"action":{"type":"string","enum":["created","configured","unchanged"]}}}',
 '{"manifest":"apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 3","namespace":"production"}',
 '{"kind":"Deployment","name":"web","action":"configured"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'kubernetes'),
 'get_logs',
 'Retrieve logs from a Kubernetes pod',
 '{"type":"object","properties":{"pod":{"type":"string","description":"Pod name"},"namespace":{"type":"string","default":"default"},"container":{"type":"string","description":"Container name (for multi-container pods)"},"tailLines":{"type":"integer","default":100}},"required":["pod"]}',
 '{"type":"object","properties":{"logs":{"type":"string"}}}',
 '{"pod":"api-7d9b8c6f4-x2k9p","namespace":"production","tailLines":50}',
 '{"logs":"[2026-03-10T12:00:00Z] INFO: Server listening on port 8080\n[2026-03-10T12:00:01Z] INFO: Connected to database"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'kubernetes'),
 'scale_deployment',
 'Scale a Kubernetes deployment to a specified number of replicas',
 '{"type":"object","properties":{"name":{"type":"string","description":"Deployment name"},"namespace":{"type":"string","default":"default"},"replicas":{"type":"integer","description":"Desired number of replicas"}},"required":["name","replicas"]}',
 '{"type":"object","properties":{"name":{"type":"string"},"replicas":{"type":"integer"},"available":{"type":"integer"}}}',
 '{"name":"web","namespace":"production","replicas":5}',
 '{"name":"web","replicas":5,"available":3}'
);

-- ---- Tools for: aws ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'aws'),
 's3_list_objects',
 'List objects in an S3 bucket with optional prefix filter',
 '{"type":"object","properties":{"bucket":{"type":"string","description":"S3 bucket name"},"prefix":{"type":"string","description":"Key prefix filter"},"maxKeys":{"type":"integer","default":100}},"required":["bucket"]}',
 '{"type":"object","properties":{"objects":{"type":"array","items":{"type":"object","properties":{"key":{"type":"string"},"size":{"type":"integer"},"lastModified":{"type":"string"}}}},"isTruncated":{"type":"boolean"}}}',
 '{"bucket":"my-data","prefix":"exports/2026/","maxKeys":10}',
 '{"objects":[{"key":"exports/2026/report.csv","size":1048576,"lastModified":"2026-03-10T08:00:00Z"}],"isTruncated":false}'
),
((SELECT id FROM mcp_servers WHERE slug = 'aws'),
 's3_get_object',
 'Download an object from S3',
 '{"type":"object","properties":{"bucket":{"type":"string","description":"S3 bucket name"},"key":{"type":"string","description":"Object key"}},"required":["bucket","key"]}',
 '{"type":"object","properties":{"body":{"type":"string","description":"Object content (text) or base64 (binary)"},"contentType":{"type":"string"},"contentLength":{"type":"integer"}}}',
 '{"bucket":"my-data","key":"config/settings.json"}',
 '{"body":"{\"version\":\"2.0\",\"debug\":false}","contentType":"application/json","contentLength":34}'
),
((SELECT id FROM mcp_servers WHERE slug = 'aws'),
 'lambda_invoke',
 'Invoke an AWS Lambda function',
 '{"type":"object","properties":{"functionName":{"type":"string","description":"Lambda function name or ARN"},"payload":{"type":"object","description":"JSON payload to send"},"invocationType":{"type":"string","enum":["RequestResponse","Event"],"default":"RequestResponse"}},"required":["functionName"]}',
 '{"type":"object","properties":{"statusCode":{"type":"integer"},"payload":{"type":"object"},"executedVersion":{"type":"string"}}}',
 '{"functionName":"process-order","payload":{"orderId":"ord-123"},"invocationType":"RequestResponse"}',
 '{"statusCode":200,"payload":{"processed":true,"orderId":"ord-123"},"executedVersion":"$LATEST"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'aws'),
 'dynamodb_query',
 'Query items from a DynamoDB table',
 '{"type":"object","properties":{"tableName":{"type":"string","description":"DynamoDB table name"},"keyCondition":{"type":"string","description":"Key condition expression"},"expressionValues":{"type":"object","description":"Expression attribute values"},"limit":{"type":"integer"}},"required":["tableName","keyCondition","expressionValues"]}',
 '{"type":"object","properties":{"items":{"type":"array","items":{"type":"object"}},"count":{"type":"integer"},"scannedCount":{"type":"integer"}}}',
 '{"tableName":"orders","keyCondition":"userId = :uid","expressionValues":{":uid":"user-123"},"limit":10}',
 '{"items":[{"userId":"user-123","orderId":"ord-001","total":99.99}],"count":1,"scannedCount":1}'
);

-- ---- Tools for: supabase ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'supabase'),
 'execute_sql',
 'Execute a SQL query against the Supabase PostgreSQL database',
 '{"type":"object","properties":{"query":{"type":"string","description":"SQL query to execute"},"project_id":{"type":"string","description":"Supabase project reference ID"}},"required":["query","project_id"]}',
 '{"type":"object","properties":{"rows":{"type":"array","items":{"type":"object"}},"rowCount":{"type":"integer"}}}',
 '{"query":"SELECT count(*) as total FROM auth.users","project_id":"abcdefghijklmnop"}',
 '{"rows":[{"total":1523}],"rowCount":1}'
),
((SELECT id FROM mcp_servers WHERE slug = 'supabase'),
 'list_tables',
 'List all tables in the Supabase database with schema information',
 '{"type":"object","properties":{"project_id":{"type":"string","description":"Supabase project reference ID"},"schema":{"type":"string","default":"public"}},"required":["project_id"]}',
 '{"type":"object","properties":{"tables":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"schema":{"type":"string"},"row_count":{"type":"integer"}}}}}}',
 '{"project_id":"abcdefghijklmnop","schema":"public"}',
 '{"tables":[{"name":"users","schema":"public","row_count":1523},{"name":"orders","schema":"public","row_count":8921}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'supabase'),
 'apply_migration',
 'Apply a SQL migration to the Supabase database',
 '{"type":"object","properties":{"project_id":{"type":"string","description":"Supabase project reference ID"},"name":{"type":"string","description":"Migration name"},"query":{"type":"string","description":"SQL migration content"}},"required":["project_id","name","query"]}',
 '{"type":"object","properties":{"success":{"type":"boolean"},"migration_id":{"type":"string"}}}',
 '{"project_id":"abcdefghijklmnop","name":"add_status_column","query":"ALTER TABLE orders ADD COLUMN status text DEFAULT ''pending''"}',
 '{"success":true,"migration_id":"20260310120000"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'supabase'),
 'get_project',
 'Get details about a Supabase project',
 '{"type":"object","properties":{"project_id":{"type":"string","description":"Supabase project reference ID"}},"required":["project_id"]}',
 '{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"region":{"type":"string"},"status":{"type":"string"},"database":{"type":"object","properties":{"host":{"type":"string"},"version":{"type":"string"}}}}}',
 '{"project_id":"abcdefghijklmnop"}',
 '{"id":"abcdefghijklmnop","name":"my-app","region":"eu-central-1","status":"ACTIVE_HEALTHY","database":{"host":"db.abcdefghijklmnop.supabase.co","version":"15.1"}}'
);

-- ---- Tools for: playwright ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'playwright'),
 'browser_navigate',
 'Navigate the browser to a URL',
 '{"type":"object","properties":{"url":{"type":"string","description":"URL to navigate to"}},"required":["url"]}',
 '{"type":"object","properties":{"title":{"type":"string"},"url":{"type":"string"}}}',
 '{"url":"https://agentforge.eu"}',
 '{"title":"AgentForge - MCP Server Marketplace","url":"https://agentforge.eu/"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'playwright'),
 'browser_snapshot',
 'Capture an accessibility snapshot of the current page for element targeting',
 '{"type":"object","properties":{},"required":[]}',
 '{"type":"object","properties":{"snapshot":{"type":"string","description":"Accessibility tree representation of the page"}}}',
 '{}',
 '{"snapshot":"- navigation \"Main\"\n  - link \"Home\" [ref=1]\n  - link \"Marketplace\" [ref=2]\n- main\n  - heading \"Welcome to AgentForge\" [level=1]\n  - button \"Get Started\" [ref=3]"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'playwright'),
 'browser_click',
 'Click an element identified by its accessibility snapshot reference',
 '{"type":"object","properties":{"element":{"type":"string","description":"Human-readable element description from the snapshot"},"ref":{"type":"integer","description":"Element reference number from snapshot"}},"required":["element","ref"]}',
 '{"type":"object","properties":{"success":{"type":"boolean"}}}',
 '{"element":"Get Started button","ref":3}',
 '{"success":true}'
),
((SELECT id FROM mcp_servers WHERE slug = 'playwright'),
 'browser_take_screenshot',
 'Take a screenshot of the current page',
 '{"type":"object","properties":{"fullPage":{"type":"boolean","default":false}},"required":[]}',
 '{"type":"object","properties":{"imageData":{"type":"string","description":"Base64-encoded PNG screenshot"}}}',
 '{"fullPage":true}',
 '{"imageData":"iVBORw0KGgo..."}'
);

-- ---- Tools for: anthropic ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'anthropic'),
 'create_message',
 'Generate a message using a Claude model',
 '{"type":"object","properties":{"model":{"type":"string","default":"claude-sonnet-4-20250514","description":"Claude model ID"},"messages":{"type":"array","items":{"type":"object","properties":{"role":{"type":"string","enum":["user","assistant"]},"content":{"type":"string"}}}},"max_tokens":{"type":"integer","default":1024},"system":{"type":"string","description":"System prompt"},"temperature":{"type":"number","default":1.0}},"required":["messages","max_tokens"]}',
 '{"type":"object","properties":{"content":{"type":"string"},"model":{"type":"string"},"stop_reason":{"type":"string"},"usage":{"type":"object","properties":{"input_tokens":{"type":"integer"},"output_tokens":{"type":"integer"}}}}}',
 '{"model":"claude-sonnet-4-20250514","messages":[{"role":"user","content":"What is MCP?"}],"max_tokens":256}',
 '{"content":"MCP (Model Context Protocol) is an open protocol that enables AI assistants to connect with external data sources and tools in a standardized way.","model":"claude-sonnet-4-20250514","stop_reason":"end_turn","usage":{"input_tokens":12,"output_tokens":35}}'
),
((SELECT id FROM mcp_servers WHERE slug = 'anthropic'),
 'count_tokens',
 'Count the number of tokens in a message without generating a response',
 '{"type":"object","properties":{"model":{"type":"string","default":"claude-sonnet-4-20250514"},"messages":{"type":"array","items":{"type":"object","properties":{"role":{"type":"string"},"content":{"type":"string"}}}},"system":{"type":"string"}},"required":["model","messages"]}',
 '{"type":"object","properties":{"input_tokens":{"type":"integer"}}}',
 '{"model":"claude-sonnet-4-20250514","messages":[{"role":"user","content":"Hello, how are you?"}]}',
 '{"input_tokens":14}'
),
((SELECT id FROM mcp_servers WHERE slug = 'anthropic'),
 'list_models',
 'List available Claude models and their capabilities',
 '{"type":"object","properties":{},"required":[]}',
 '{"type":"object","properties":{"models":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"display_name":{"type":"string"},"max_tokens":{"type":"integer"},"supports_vision":{"type":"boolean"}}}}}}',
 '{}',
 '{"models":[{"id":"claude-opus-4-20250514","display_name":"Claude Opus 4","max_tokens":32000,"supports_vision":true},{"id":"claude-sonnet-4-20250514","display_name":"Claude Sonnet 4","max_tokens":8192,"supports_vision":true}]}'
);

-- ---- Tools for: vercel ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'vercel'),
 'list_deployments',
 'List recent deployments for a Vercel project',
 '{"type":"object","properties":{"projectId":{"type":"string","description":"Vercel project ID or name"},"limit":{"type":"integer","default":10},"state":{"type":"string","enum":["BUILDING","ERROR","INITIALIZING","QUEUED","READY","CANCELED"]}},"required":["projectId"]}',
 '{"type":"object","properties":{"deployments":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"url":{"type":"string"},"state":{"type":"string"},"created":{"type":"string"},"meta":{"type":"object"}}}}}}',
 '{"projectId":"my-app","limit":5,"state":"READY"}',
 '{"deployments":[{"id":"dpl_abc123","url":"my-app-abc123.vercel.app","state":"READY","created":"2026-03-10T12:00:00Z","meta":{"githubCommitRef":"main"}}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'vercel'),
 'get_deployment',
 'Get details about a specific Vercel deployment including build logs',
 '{"type":"object","properties":{"deploymentId":{"type":"string","description":"Deployment ID or URL"}},"required":["deploymentId"]}',
 '{"type":"object","properties":{"id":{"type":"string"},"url":{"type":"string"},"state":{"type":"string"},"buildLogs":{"type":"array","items":{"type":"object","properties":{"timestamp":{"type":"string"},"text":{"type":"string"}}}}}}',
 '{"deploymentId":"dpl_abc123"}',
 '{"id":"dpl_abc123","url":"my-app-abc123.vercel.app","state":"READY","buildLogs":[{"timestamp":"2026-03-10T12:00:05Z","text":"Build completed in 45s"}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'vercel'),
 'list_projects',
 'List all projects in the Vercel account or team',
 '{"type":"object","properties":{"teamId":{"type":"string","description":"Team ID (optional, defaults to personal account)"},"limit":{"type":"integer","default":20}},"required":[]}',
 '{"type":"object","properties":{"projects":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"framework":{"type":"string"},"latestDeployment":{"type":"string"}}}}}}',
 '{"limit":5}',
 '{"projects":[{"id":"prj_abc","name":"my-app","framework":"nextjs","latestDeployment":"dpl_abc123"}]}'
);

-- ---- Tools for: linear ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'linear'),
 'create_issue',
 'Create a new issue in a Linear project',
 '{"type":"object","properties":{"title":{"type":"string","description":"Issue title"},"description":{"type":"string","description":"Issue description in Markdown"},"teamId":{"type":"string","description":"Linear team ID"},"priority":{"type":"integer","description":"Priority (0=none, 1=urgent, 2=high, 3=medium, 4=low)"},"labels":{"type":"array","items":{"type":"string"}}},"required":["title","teamId"]}',
 '{"type":"object","properties":{"id":{"type":"string"},"identifier":{"type":"string"},"url":{"type":"string"}}}',
 '{"title":"Fix login timeout on mobile","description":"Users report 30s timeout on mobile login flow","teamId":"TEAM-1","priority":2,"labels":["bug","mobile"]}',
 '{"id":"abc-123","identifier":"ENG-142","url":"https://linear.app/team/issue/ENG-142"}'
),
((SELECT id FROM mcp_servers WHERE slug = 'linear'),
 'search_issues',
 'Search for issues across the Linear workspace',
 '{"type":"object","properties":{"query":{"type":"string","description":"Search query"},"teamId":{"type":"string","description":"Filter by team"},"status":{"type":"string","description":"Filter by status (e.g. In Progress, Done)"}},"required":["query"]}',
 '{"type":"object","properties":{"issues":{"type":"array","items":{"type":"object","properties":{"identifier":{"type":"string"},"title":{"type":"string"},"status":{"type":"string"},"assignee":{"type":"string"},"priority":{"type":"integer"}}}}}}',
 '{"query":"login timeout","status":"In Progress"}',
 '{"issues":[{"identifier":"ENG-142","title":"Fix login timeout on mobile","status":"In Progress","assignee":"Alice","priority":2}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'linear'),
 'update_issue',
 'Update an existing Linear issue',
 '{"type":"object","properties":{"issueId":{"type":"string","description":"Issue ID or identifier (e.g. ENG-142)"},"status":{"type":"string","description":"New status"},"assigneeId":{"type":"string","description":"Assignee user ID"},"priority":{"type":"integer"},"comment":{"type":"string","description":"Add a comment to the issue"}},"required":["issueId"]}',
 '{"type":"object","properties":{"id":{"type":"string"},"identifier":{"type":"string"},"status":{"type":"string"},"updatedAt":{"type":"string"}}}',
 '{"issueId":"ENG-142","status":"Done","comment":"Fixed in PR #87"}',
 '{"id":"abc-123","identifier":"ENG-142","status":"Done","updatedAt":"2026-03-10T14:00:00Z"}'
);

-- ---- Tools for: sentry ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'sentry'),
 'list_issues',
 'List issues (errors) from a Sentry project',
 '{"type":"object","properties":{"organization":{"type":"string","description":"Sentry organization slug"},"project":{"type":"string","description":"Sentry project slug"},"query":{"type":"string","description":"Search query"},"sort":{"type":"string","enum":["date","new","freq"],"default":"date"}},"required":["organization","project"]}',
 '{"type":"object","properties":{"issues":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"culprit":{"type":"string"},"count":{"type":"integer"},"firstSeen":{"type":"string"},"lastSeen":{"type":"string"}}}}}}',
 '{"organization":"my-org","project":"web-app","query":"is:unresolved","sort":"freq"}',
 '{"issues":[{"id":"12345","title":"TypeError: Cannot read property map of undefined","culprit":"components/ProductList.tsx","count":342,"firstSeen":"2026-03-08T10:00:00Z","lastSeen":"2026-03-10T11:30:00Z"}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'sentry'),
 'get_issue_events',
 'Get detailed error events for a specific Sentry issue, including stack traces',
 '{"type":"object","properties":{"organization":{"type":"string"},"issueId":{"type":"string","description":"Sentry issue ID"}},"required":["organization","issueId"]}',
 '{"type":"object","properties":{"events":{"type":"array","items":{"type":"object","properties":{"eventId":{"type":"string"},"timestamp":{"type":"string"},"stacktrace":{"type":"object"},"tags":{"type":"object"},"user":{"type":"object"}}}}}}',
 '{"organization":"my-org","issueId":"12345"}',
 '{"events":[{"eventId":"evt-abc","timestamp":"2026-03-10T11:30:00Z","stacktrace":{"frames":[{"filename":"components/ProductList.tsx","lineno":42,"function":"renderProducts"}]},"tags":{"browser":"Chrome 120"},"user":{"id":"user-789"}}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'sentry'),
 'resolve_issue',
 'Resolve or unresolve a Sentry issue',
 '{"type":"object","properties":{"organization":{"type":"string"},"issueId":{"type":"string"},"status":{"type":"string","enum":["resolved","unresolved","ignored"]}},"required":["organization","issueId","status"]}',
 '{"type":"object","properties":{"id":{"type":"string"},"status":{"type":"string"}}}',
 '{"organization":"my-org","issueId":"12345","status":"resolved"}',
 '{"id":"12345","status":"resolved"}'
);

-- ---- Tools for: grafana ----
INSERT INTO mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) VALUES
((SELECT id FROM mcp_servers WHERE slug = 'grafana'),
 'search_dashboards',
 'Search for Grafana dashboards by name or tag',
 '{"type":"object","properties":{"query":{"type":"string","description":"Search query"},"tag":{"type":"string","description":"Filter by dashboard tag"}},"required":[]}',
 '{"type":"object","properties":{"dashboards":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer"},"uid":{"type":"string"},"title":{"type":"string"},"url":{"type":"string"},"tags":{"type":"array","items":{"type":"string"}}}}}}}',
 '{"query":"API","tag":"production"}',
 '{"dashboards":[{"id":1,"uid":"abc123","title":"API Performance","url":"/d/abc123/api-performance","tags":["production","api"]}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'grafana'),
 'query_datasource',
 'Execute a query against a Grafana datasource (Prometheus, InfluxDB, etc.)',
 '{"type":"object","properties":{"datasourceUid":{"type":"string","description":"Datasource UID"},"query":{"type":"string","description":"Query expression (PromQL, InfluxQL, etc.)"},"from":{"type":"string","default":"now-1h","description":"Start time"},"to":{"type":"string","default":"now","description":"End time"}},"required":["datasourceUid","query"]}',
 '{"type":"object","properties":{"results":{"type":"array","items":{"type":"object","properties":{"metric":{"type":"string"},"values":{"type":"array","items":{"type":"array"}}}}}}}',
 '{"datasourceUid":"prometheus-1","query":"rate(http_requests_total{job=\"api\"}[5m])","from":"now-1h","to":"now"}',
 '{"results":[{"metric":"http_requests_total{job=\"api\",method=\"GET\"}","values":[[1709836800,42.5],[1709837100,38.2]]}]}'
),
((SELECT id FROM mcp_servers WHERE slug = 'grafana'),
 'list_alerts',
 'List active Grafana alerts',
 '{"type":"object","properties":{"state":{"type":"string","enum":["alerting","pending","normal","nodata","error"],"description":"Filter by alert state"}},"required":[]}',
 '{"type":"object","properties":{"alerts":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"state":{"type":"string"},"severity":{"type":"string"},"summary":{"type":"string"},"activeAt":{"type":"string"}}}}}}',
 '{"state":"alerting"}',
 '{"alerts":[{"name":"High API Latency","state":"alerting","severity":"warning","summary":"API p99 latency > 500ms for 5 minutes","activeAt":"2026-03-10T11:45:00Z"}]}'
);

-- ============================================================
-- Update total_tools counts to match actual inserted tools
-- ============================================================
UPDATE mcp_servers SET total_tools = (
  SELECT count(*) FROM mcp_tools WHERE mcp_tools.server_id = mcp_servers.id
);

COMMIT;
