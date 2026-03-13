# AgentForge "Amazon for Agents" — Implementation Plan

## P0 — Foundation (DONE)
- [x] Agent reviews (verified by usage)
- [x] Agent preferences (preferred_categories, budget, pricing)
- [x] Health endpoint (/api/v1/health)
- [x] .well-known/agentforge.json discovery standard
- [x] PostgreSQL full-text search (tsvector + GIN)

## P1 — Broadcast Search + Cost Transparency (DONE)
- [x] POST /api/v1/search/broadcast — multi-server search one call
- [x] GET /api/v1/server/[id]/capabilities — server capabilities + pricing
- [x] X-Cost-Per-Call + X-Cost-Estimate headers on /call
- [x] Extend discover response with review summaries
- [x] access_types column on mcp_servers (api/cli/mcp/webhook)

## P2 — Product Listings + Cross-Server Search (DONE)
- [x] Migration: product_listings table + FTS
- [x] POST /api/v1/server/[id]/products — publish products
- [x] GET /api/v1/products — cross-server product search (with freshness)
- [x] GET /api/v1/server/[id]/products — per-server products

## P3 — Consent Flow (Purchase Requests) (DONE)
- [x] Migration: purchase_requests table
- [x] POST /api/v1/purchase/request — consent flow
- [x] GET /api/v1/purchase/[id]/status — approval status
- [x] Approval page UI (/approve/[token])
- [x] API: /api/approve/[token] — GET (fetch) + POST (approve/reject)

## P4 — CLI Client (DONE)
- [x] NPM package `agentforge` (packages/cli)
- [x] Commands: auth, register, discover, info, call, search, products, me, health

## P5 — Recommendations + Dashboard (DONE)
- [x] GET /api/v1/agents/recommendations — preference + top-rated strategies
- [x] Dashboard Analytics page (reviews, calls, server performance)
- [x] /api/dashboard/analytics endpoint
