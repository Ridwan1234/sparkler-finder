import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Find active investments that have expired
  const { data: expiredInvestments, error: fetchError } = await supabase
    .from("investments")
    .select("*, investment_plans(*)")
    .eq("status", "active")
    .lte("expires_at", new Date().toISOString());

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });
  }

  if (!expiredInvestments || expiredInvestments.length === 0) {
    return new Response(JSON.stringify({ message: "No expired investments to process", processed: 0 }));
  }

  let processed = 0;

  for (const inv of expiredInvestments) {
    const plan = inv.investment_plans;
    if (!plan) continue;

    const roiAmount = Number((inv.amount * plan.roi_percentage / 100).toFixed(2));

    // Insert ROI transaction
    const { error: txError } = await supabase.from("transactions").insert({
      user_id: inv.user_id,
      amount: roiAmount,
      type: "roi",
      description: `ROI from ${plan.name} plan (${plan.roi_percentage}%)`,
      reference_id: inv.id,
    });

    if (txError) {
      console.error(`Failed to insert ROI transaction for investment ${inv.id}:`, txError);
      continue;
    }

    // Mark investment as completed
    const { error: updateError } = await supabase
      .from("investments")
      .update({ status: "completed" })
      .eq("id", inv.id);

    if (updateError) {
      console.error(`Failed to update investment ${inv.id}:`, updateError);
      continue;
    }

    processed++;
  }

  return new Response(JSON.stringify({ message: `Processed ${processed} ROI payouts`, processed }));
});
