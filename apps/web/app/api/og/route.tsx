import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "AgentForge";
  const description =
    searchParams.get("description") ||
    "The EU-First Marketplace for AI Agent Tools";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0f",
          backgroundImage:
            "linear-gradient(135deg, rgba(108,92,231,0.15) 0%, rgba(0,210,255,0.15) 50%, rgba(108,92,231,0.15) 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            maxWidth: "900px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6c5ce7, #00d2ff)",
              }}
            />
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#f0f0f5",
              }}
            >
              AgentForge
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "52px",
              fontWeight: 800,
              textAlign: "center",
              lineHeight: 1.2,
              background: "linear-gradient(135deg, #6c5ce7, #00d2ff)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: "20px",
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "24px",
              color: "#a0a0b8",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>

          {/* Badge */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                border: "1px solid #2a2a40",
                color: "#a0a0b8",
                fontSize: "16px",
              }}
            >
              EU-First
            </div>
            <div
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                border: "1px solid #2a2a40",
                color: "#a0a0b8",
                fontSize: "16px",
              }}
            >
              MCP Protocol
            </div>
            <div
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                border: "1px solid #2a2a40",
                color: "#a0a0b8",
                fontSize: "16px",
              }}
            >
              10+ Servers
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(90deg, #6c5ce7, #00d2ff, #6c5ce7)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
