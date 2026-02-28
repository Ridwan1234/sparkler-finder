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
    const frequencyDays = plan.roi_frequency_days ?? 1;

    // Total number of payout periods in the plan
    const totalPeriods = Math.floor(plan.duration_days / frequencyDays);
    // ROI per payout period
    const periodROI = Number((inv.amount * plan.roi_percentage / 100 / totalPeriods).toFixed(2));

    // How many periods have elapsed since investment started (capped)
    const msElapsed = now.getTime() - startedAt.getTime();
    const daysElapsed = Math.floor(msElapsed / (24 * 60 * 60 * 1000));
    const periodsElapsed = Math.min(Math.floor(daysElapsed / frequencyDays), totalPeriods);

    // Count how many ROI transactions already exist for this investment
    const { count: existingPayouts } = await supabase
      .from("transactions")
      .select("id", { count: "exact", head: true })
      .eq("reference_id", inv.id)
      .eq("type", "roi");

    const paidPeriods = existingPayouts ?? 0;
    const owedPeriods = periodsElapsed - paidPeriods;

    // Credit any missing ROI payouts
    if (owedPeriods > 0) {
      const inserts = [];
      for (let d = 0; d < owedPeriods; d++) {
        const periodNum = paidPeriods + d + 1;
        inserts.push({
          user_id: inv.user_id,
          amount: periodROI,
          type: "roi",
          description: `ROI from ${plan.name} plan (period ${periodNum}/${totalPeriods})`,
          reference_id: inv.id,
        });
      }

      const { error: txError } = await supabase.from("transactions").insert(inserts);
      if (txError) {
        console.error(`Failed to insert ROI for investment ${inv.id}:`, txError);
        continue;
      }
      roiPaid += owedPeriods;
    }

    // Mark as completed and return principal if expired
    if (now >= expiresAt) {
      // Return the invested principal back to the user's balance
      const { error: principalError } = await supabase.from("transactions").insert({
        user_id: inv.user_id,
        amount: inv.amount,
        type: "principal_return",
        description: `Principal returned from ${plan.name} plan`,
        reference_id: inv.id,
      });

      if (principalError) {
        console.error(`Failed to return principal for investment ${inv.id}:`, principalError);
      }

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
      message: `Paid ${roiPaid} ROI payout(s), completed ${completed} investment(s)`,
      roiPaid,
      completed,
    })
  );
});
