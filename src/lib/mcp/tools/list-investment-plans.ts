import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, textResult, errorResult } from "../supabase";

export default defineTool({
  name: "list_investment_plans",
  title: "List investment plans",
  description: "List all HarborForge investment plans available to invest in.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    const { data, error } = await supabaseForUser(ctx)
      .from("investment_plans")
      .select("*")
      .order("min_amount", { ascending: true });
    if (error) return errorResult(error.message);
    return textResult(data ?? []);
  },
});
