import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (_req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Fetch all active investments with their plans
  const { data: activeInvestments, error: fetchError } = await supabase
    .from("investments")
    .select("*, investment_plans(*)")
    .eq("status", "active");

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });
  }

  if (!activeInvestments || activeInvestments.length === 0) {
    return new Response(JSON.stringify({ message: "No active investments", processed: 0 }));
  }

  const now = new Date();
  let roiPaid = 0;
  let completed = 0;

  for (const inv of activeInvestments) {
    const plan = inv.investment_plans;
    if (!plan) continue;

    const startedAt = new Date(inv.started_at);
    const expiresAt = new Date(inv.expires_at);

    // Calculate daily ROI: total ROI spread over duration_days
    const dailyROI = Number((inv.amount * plan.roi_percentage / 100 / plan.duration_days).toFixed(2));

    // How many days have elapsed since investment started (capped at duration)
    const msElapsed = now.getTime() - startedAt.getTime();
    const daysElapsed = Math.min(
      Math.floor(msElapsed / (24 * 60 * 60 * 1000)),
      plan.duration_days
    );

    // Count how many ROI transactions already exist for this investment
    const { count: existingPayouts } = await supabase
      .from("transactions")
      .select("id", { count: "exact", head: true })
      .eq("reference_id", inv.id)
      .eq("type", "roi");

    const paidDays = existingPayouts ?? 0;
    const owedDays = daysElapsed - paidDays;

    // Credit any missing daily ROI payouts
    if (owedDays > 0) {
      const inserts = [];
      for (let d = 0; d < owedDays; d++) {
        inserts.push({
          user_id: inv.user_id,
          amount: dailyROI,
          type: "roi",
          description: `Daily ROI from ${plan.name} plan (day ${paidDays + d + 1}/${plan.duration_days})`,
          reference_id: inv.id,
        });
      }

      const { error: txError } = await supabase.from("transactions").insert(inserts);
      if (txError) {
        console.error(`Failed to insert ROI for investment ${inv.id}:`, txError);
        continue;
      }
      roiPaid += owedDays;
    }

    // Mark as completed if expired
    if (now >= expiresAt) {
      const { error: updateError } = await supabase
        .from("investments")
        .update({ status: "completed" })
        .eq("id", inv.id);

      if (updateError) {
        console.error(`Failed to complete investment ${inv.id}:`, updateError);
      } else {
        completed++;
      }
    }
  }

  return new Response(
    JSON.stringify({
      message: `Paid ${roiPaid} daily ROI(s), completed ${completed} investment(s)`,
      roiPaid,
      completed,
    })
  );
});
