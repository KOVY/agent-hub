"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const CATEGORIES = [
  { value: "finance", label: "Finance & Accounting" },
  { value: "legal", label: "Legal & Compliance" },
  { value: "data", label: "Data & Analytics" },
  { value: "communication", label: "Communication" },
  { value: "development", label: "Development Tools" },
  { value: "ai", label: "AI & Machine Learning" },
  { value: "productivity", label: "Productivity" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
];

export default function PublishServerPage() {
  const router = useRouter();
  const locale = useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "development",
    endpoint_url: "",
    long_description: "",
    pricing_model: "free",
    tags: "",
    documentation_url: "",
    source_url: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      endpoint_url: form.endpoint_url || undefined,
      documentation_url: form.documentation_url || undefined,
      source_url: form.source_url || undefined,
    };

    try {
      const res = await fetch("/api/dashboard/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to publish server");
        setSubmitting(false);
        return;
      }

      router.push(`/${locale}/dashboard/servers`);
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Publish MCP Server</h1>
      <p className="text-muted-foreground mb-8">
        Register your MCP server so AI agents can discover and use it.
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Server Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. My MCP Server"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Short Description *
          </label>
          <input
            id="description"
            name="description"
            type="text"
            required
            value={form.description}
            onChange={handleChange}
            placeholder="One-line description of what your server does"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Endpoint URL */}
        <div>
          <label htmlFor="endpoint_url" className="block text-sm font-medium mb-2">
            MCP Endpoint URL
          </label>
          <input
            id="endpoint_url"
            name="endpoint_url"
            type="url"
            value={form.endpoint_url}
            onChange={handleChange}
            placeholder="https://your-server.com/mcp (leave empty if not deployed yet)"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="text-xs text-muted-foreground mt-1">
            The URL where your MCP server is running. Leave empty for a placeholder listing.
          </p>
        </div>

        {/* Long Description */}
        <div>
          <label htmlFor="long_description" className="block text-sm font-medium mb-2">
            Detailed Description
          </label>
          <textarea
            id="long_description"
            name="long_description"
            rows={4}
            value={form.long_description}
            onChange={handleChange}
            placeholder="Detailed description — what tools does your server provide? What problems does it solve?"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
          />
        </div>

        {/* Pricing Model */}
        <div>
          <label htmlFor="pricing_model" className="block text-sm font-medium mb-2">
            Pricing Model
          </label>
          <select
            id="pricing_model"
            name="pricing_model"
            value={form.pricing_model}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={form.tags}
            onChange={handleChange}
            placeholder="comma, separated, tags"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Documentation URL */}
        <div>
          <label htmlFor="documentation_url" className="block text-sm font-medium mb-2">
            Documentation URL
          </label>
          <input
            id="documentation_url"
            name="documentation_url"
            type="url"
            value={form.documentation_url}
            onChange={handleChange}
            placeholder="https://docs.example.com"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Source URL */}
        <div>
          <label htmlFor="source_url" className="block text-sm font-medium mb-2">
            Source Code URL
          </label>
          <input
            id="source_url"
            name="source_url"
            type="url"
            value={form.source_url}
            onChange={handleChange}
            placeholder="https://github.com/you/your-mcp-server"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "Publish Server"}
          </button>
        </div>
      </form>

      {/* Agent API hint */}
      <div className="mt-8 glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold mb-2">Publish via API</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Agents can also publish servers programmatically:
        </p>
        <pre className="bg-muted rounded-lg p-3 overflow-x-auto text-xs">
{`curl -X POST https://agentforge.eu/api/v1/servers \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Server",
    "description": "What it does",
    "category": "development",
    "endpoint_url": "https://my-server.com/mcp",
    "tools": [{
      "name": "my_tool",
      "description": "Tool description",
      "input_schema": {"type": "object", "properties": {}}
    }]
  }'`}
        </pre>
      </div>
    </div>
  );
}
