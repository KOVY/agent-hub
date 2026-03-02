import { type NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { MOCK_SERVERS, getMockTools } from "@/lib/mock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Support lookup by ID or slug
  const server = MOCK_SERVERS.find(
    (s) => s.id === id || s.slug === id
  );

  if (!server) {
    return apiError("Server not found", 404);
  }

  const tools = getMockTools(server.slug);

  return apiSuccess({
    ...server,
    tools: tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema,
      output_schema: t.output_schema,
    })),
  });
}
