import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, textResult, errorResult } from "../supabase";

export default defineTool({
  name: "get_profile",
  title: "Get my profile",
  description: "Return the signed-in HarborForge user's profile information.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", ctx.getUserId())
      .maybeSingle();
    if (error) return errorResult(error.message);
    return textResult(data ?? { id: ctx.getUserId(), email: ctx.getUserEmail() });
  },
});
