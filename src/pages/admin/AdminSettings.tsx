import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Pencil, Plus, Save, Trash2, X, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Plan = {
  id: string;
  name: string;
  min_amount: number;
  max_amount: number;
  roi_percentage: number;
  duration_days: number;
  features: string[];
  is_popular: boolean;
};

type PlanForm = Omit<Plan, "id"> & { id?: string };

const emptyPlan: PlanForm = {
  name: "",
  min_amount: 0,
  max_amount: 0,
  roi_percentage: 0,
  duration_days: 0,
  features: [],
  is_popular: false,
};

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<PlanForm | null>(null);
  const [featureInput, setFeatureInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Plan | null>(null);

  // Fetch site settings
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      return data ?? [];
    },
  });

  const bonusSetting = settings?.find((s) => s.key === "first_deposit_bonus_percent");
  const [bonusValue, setBonusValue] = useState<string>("");

  // Sync bonus value when data loads
  const displayBonus = bonusValue || bonusSetting?.value || "";

  // Fetch plans
  const { data: plans, isLoading } = useQuery({
    queryKey: ["admin_investment_plans"],
    queryFn: async () => {
      const { data } = await supabase
        .from("investment_plans")
        .select("*")
        .order("min_amount", { ascending: true });
      return (data ?? []) as Plan[];
    },
  });

  // Update site setting
  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ value })
        .eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast({ title: "Setting updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Save plan (insert or update)
  const savePlan = useMutation({
    mutationFn: async (plan: PlanForm) => {
      const payload = {
        name: plan.name,
        min_amount: plan.min_amount,
        max_amount: plan.max_amount,
        roi_percentage: plan.roi_percentage,
        duration_days: plan.duration_days,
        features: plan.features,
        is_popular: plan.is_popular,
      };
      if (plan.id) {
        const { error } = await supabase.from("investment_plans").update(payload).eq("id", plan.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("investment_plans").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_investment_plans"] });
      queryClient.invalidateQueries({ queryKey: ["investment_plans"] });
      setDialogOpen(false);
      setEditingPlan(null);
      toast({ title: "Plan saved" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Delete plan
  const deletePlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("investment_plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_investment_plans"] });
      queryClient.invalidateQueries({ queryKey: ["investment_plans"] });
      toast({ title: "Plan deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const openCreate = () => {
    setEditingPlan({ ...emptyPlan });
    setFeatureInput("");
    setDialogOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setFeatureInput("");
    setDialogOpen(true);
  };

  const addFeature = () => {
    if (!featureInput.trim() || !editingPlan) return;
    setEditingPlan({ ...editingPlan, features: [...editingPlan.features, featureInput.trim()] });
    setFeatureInput("");
  };

  const removeFeature = (idx: number) => {
    if (!editingPlan) return;
    setEditingPlan({ ...editingPlan, features: editingPlan.features.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground">Settings</h1>

      {/* Site Settings */}
      <Card className="bg-card/5 border-border/10">
        <CardHeader>
          <CardTitle className="text-section-dark-foreground">Site Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label className="text-muted-foreground">First Deposit Bonus (%)</Label>
              <Input
                type="number"
                value={displayBonus}
                onChange={(e) => setBonusValue(e.target.value)}
                className="max-w-xs bg-background/5 border-border/20 text-section-dark-foreground"
              />
            </div>
            <Button
              size="sm"
              onClick={() => updateSetting.mutate({ key: "first_deposit_bonus_percent", value: bonusValue || displayBonus })}
              disabled={updateSetting.isPending}
            >
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator className="border-border/10" />

      {/* Investment Plans */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-section-dark-foreground">Investment Plans</h2>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" /> Add Plan
          </Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans?.map((plan) => (
              <Card key={plan.id} className="bg-card/5 border-border/10 relative">
                {plan.is_popular && (
                  <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-section-dark-foreground">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>ROI: {plan.roi_percentage}% &middot; {plan.duration_days} days</p>
                  <p>${plan.min_amount.toLocaleString()} – ${plan.max_amount.toLocaleString()}</p>
                  <ul className="list-disc list-inside text-xs">
                    {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(plan)}>
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePlan.mutate(plan.id)}
                      disabled={deletePlan.isPending}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Plan Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border/20 text-section-dark-foreground max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan?.id ? "Edit Plan" : "New Plan"}</DialogTitle>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={editingPlan.name} onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Amount</Label>
                  <Input type="number" value={editingPlan.min_amount} onChange={(e) => setEditingPlan({ ...editingPlan, min_amount: +e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Max Amount</Label>
                  <Input type="number" value={editingPlan.max_amount} onChange={(e) => setEditingPlan({ ...editingPlan, max_amount: +e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ROI %</Label>
                  <Input type="number" value={editingPlan.roi_percentage} onChange={(e) => setEditingPlan({ ...editingPlan, roi_percentage: +e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Duration (days)</Label>
                  <Input type="number" value={editingPlan.duration_days} onChange={(e) => setEditingPlan({ ...editingPlan, duration_days: +e.target.value })} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editingPlan.is_popular} onCheckedChange={(v) => setEditingPlan({ ...editingPlan, is_popular: v })} />
                <Label>Mark as Popular</Label>
              </div>
              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a feature"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" size="sm" onClick={addFeature}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingPlan.features.map((f, i) => (
                    <span key={i} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      {f}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(i)} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => editingPlan && savePlan.mutate(editingPlan)} disabled={savePlan.isPending}>
              {savePlan.isPending ? "Saving..." : "Save Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
