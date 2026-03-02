import { type NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { MOCK_SERVERS, getMockTools } from "@/lib/mock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const server = MOCK_SERVERS.find(
    (s) => s.id === id || s.slug === id
  );

  if (!server) {
    return apiError("Server not found", 404);
  }

  const tools = getMockTools(server.slug);

  return apiSuccess({
    server_id: server.id,
    server_name: server.name,
    tools: tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema,
      output_schema: t.output_schema,
      example_input: t.example_input,
      example_output: t.example_output,
    })),
  });
}
