import { type NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api/response";
import { fetchServerByIdOrSlug, fetchToolsByServerId } from "@/lib/data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const server = await fetchServerByIdOrSlug(id);

  if (!server) {
    return apiError("Server not found", 404);
  }

  const tools = await fetchToolsByServerId(server.id);

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
