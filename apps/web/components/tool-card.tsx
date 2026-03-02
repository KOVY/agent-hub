import type { McpTool } from "@agent-hub/db";
import { useTranslations } from "next-intl";

export function ToolCard({ tool }: { tool: McpTool }) {
  const t = useTranslations("server");

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-mono text-sm font-semibold text-primary">
          {tool.name}
        </h3>
        <span className="text-xs text-muted-foreground">
          ~{tool.avg_response_ms}ms
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>

      {/* Input Schema */}
      <div className="mb-3">
        <h4 className="text-xs font-medium text-foreground mb-1">
          {t("inputSchema")}
        </h4>
        <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto text-muted-foreground">
          {JSON.stringify(tool.input_schema, null, 2)}
        </pre>
      </div>

      {/* Example */}
      {tool.example_input && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-foreground mb-1">
            {t("example")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto text-muted-foreground">
              <span className="text-success">// Input</span>
              {"\n"}
              {JSON.stringify(tool.example_input, null, 2)}
            </pre>
            {tool.example_output && (
              <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto text-muted-foreground">
                <span className="text-accent">// Output</span>
                {"\n"}
                {JSON.stringify(tool.example_output, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
