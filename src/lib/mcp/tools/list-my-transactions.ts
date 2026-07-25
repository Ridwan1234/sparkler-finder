import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, textResult, errorResult } from "../supabase";

export default defineTool({
  name: "list_my_transactions",
  title: "List my transactions",
  description: "List the signed-in user's transaction history, newest first.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Maximum number of transactions to return (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    const { data, error } = await supabaseForUser(ctx)
      .from("transactions")
      .select("*")
      .eq("user_id", ctx.getUserId())
      .order("created_at", { ascending: false })
      .limit(Math.min(limit ?? 50, 500));
    if (error) return errorResult(error.message);
    return textResult(data ?? []);
  },
});
