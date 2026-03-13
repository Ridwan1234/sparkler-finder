import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Pencil, Plus, Save, Trash2, X, AlertTriangle, Wallet, Copy, MessageSquareQuote, Star, Upload, ImageIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CRYPTO_NETWORKS, getNetworkByValue } from "@/lib/cryptoNetworks";
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
  roi_frequency_days: number;
  features: string[];
  is_popular: boolean;
  details: string;
};

type PlanForm = Omit<Plan, "id"> & { id?: string };

type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  is_active: boolean;
  sort_order: number;
  avatar_url: string | null;
};

type TestimonialForm = Omit<Testimonial, "id"> & { id?: string };

const emptyPlan: PlanForm = {
  name: "",
  min_amount: 0,
  max_amount: 0,
  roi_percentage: 0,
  duration_days: 0,
  roi_frequency_days: 1,
  features: [],
  is_popular: false,
  details: "",
};

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<PlanForm | null>(null);
  const [featureInput, setFeatureInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Plan | null>(null);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<{ id?: string; label: string; address: string; network: string; is_active: boolean }>({ label: "", address: "", network: "BTC", is_active: true });
  const [deleteWalletConfirm, setDeleteWalletConfirm] = useState<{ id: string; label: string } | null>(null);

  // Testimonials state
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialForm>({ name: "", role: "", text: "", rating: 5, is_active: true, sort_order: 0, avatar_url: null });
  const [deleteTestimonialConfirm, setDeleteTestimonialConfirm] = useState<{ id: string; name: string } | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

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
        roi_frequency_days: plan.roi_frequency_days,
        features: plan.features,
        is_popular: plan.is_popular,
        details: plan.details,
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

  // Fetch wallet addresses
  const { data: wallets } = useQuery({
    queryKey: ["wallet_addresses"],
    queryFn: async () => {
      const { data } = await supabase.from("wallet_addresses").select("*").order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  // Save wallet
  const saveWallet = useMutation({
    mutationFn: async (w: typeof editingWallet) => {
      const payload = { label: w.label, address: w.address, network: w.network, is_active: w.is_active };
      if (w.id) {
        const { error } = await supabase.from("wallet_addresses").update(payload).eq("id", w.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("wallet_addresses").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet_addresses"] });
      setWalletDialogOpen(false);
      toast({ title: "Wallet saved" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Delete wallet
  const deleteWallet = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("wallet_addresses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet_addresses"] });
      toast({ title: "Wallet deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Fetch testimonials
  const { data: testimonials } = useQuery({
    queryKey: ["admin_testimonials"],
    queryFn: async () => {
      const { data } = await supabase.from("testimonials").select("*").order("sort_order", { ascending: true });
      return (data ?? []) as Testimonial[];
    },
  });

  // Upload testimonial avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("testimonial-avatars").upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("testimonial-avatars").getPublicUrl(fileName);
      setEditingTestimonial((prev) => ({ ...prev, avatar_url: publicUrl }));
      toast({ title: "Avatar uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setAvatarUploading(false);
    }
  };

  // Save testimonial
  const saveTestimonial = useMutation({
    mutationFn: async (t: TestimonialForm) => {
      const payload = { name: t.name, role: t.role, text: t.text, rating: t.rating, is_active: t.is_active, sort_order: t.sort_order, avatar_url: t.avatar_url };
      if (t.id) {
        const { error } = await supabase.from("testimonials").update(payload).eq("id", t.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setTestimonialDialogOpen(false);
      toast({ title: "Testimonial saved" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Delete testimonial
  const deleteTestimonial = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast({ title: "Testimonial deleted" });
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

      {/* Wallet Addresses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-section-dark-foreground">Deposit Wallet Addresses</h2>
          <Button size="sm" onClick={() => { setEditingWallet({ label: "", address: "", network: "BTC", is_active: true }); setWalletDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Wallet
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {wallets?.map((w) => (
            <Card key={w.id} className={`bg-card/5 border-border/10 relative ${!w.is_active ? 'opacity-50' : ''}`}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getNetworkByValue(w.network)?.logo ? (
                      <img src={getNetworkByValue(w.network)!.logo} alt={w.network} className="h-5 w-5 rounded-full" />
                    ) : (
                      <Wallet className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-medium text-section-dark-foreground">{w.label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{getNetworkByValue(w.network)?.label || w.network}</Badge>
                </div>
                <p className="text-xs font-mono text-muted-foreground break-all">{w.address}</p>
                {!w.is_active && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => { setEditingWallet({ id: w.id, label: w.label, address: w.address, network: w.network, is_active: w.is_active }); setWalletDialogOpen(true); }}>
                    <Pencil className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteWalletConfirm({ id: w.id, label: w.label })}>
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!wallets?.length && <p className="text-muted-foreground text-sm">No wallet addresses configured.</p>}
        </div>
      </div>

      <Separator className="border-border/10" />
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
                  <p>ROI: {plan.roi_percentage}% &middot; {plan.duration_days} days &middot; Every {plan.roi_frequency_days}d</p>
                  <p>${plan.min_amount.toLocaleString()} – ${plan.max_amount.toLocaleString()}</p>
                  {plan.details && <p className="text-xs italic text-muted-foreground/80">{plan.details}</p>}
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
                      onClick={() => setDeleteConfirm(plan)}
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

      <Separator className="border-border/10" />

      {/* Testimonials */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-section-dark-foreground flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-primary" /> Testimonials
          </h2>
          <Button size="sm" onClick={() => { setEditingTestimonial({ name: "", role: "", text: "", rating: 5, is_active: true, sort_order: (testimonials?.length ?? 0) + 1 }); setTestimonialDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Testimonial
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials?.map((t) => (
            <Card key={t.id} className={`bg-card/5 border-border/10 relative ${!t.is_active ? 'opacity-50' : ''}`}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-xs">{t.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-section-dark-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={12} className="fill-gold text-gold" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3">"{t.text}"</p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-1">
                    {!t.is_active && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                    <Badge variant="outline" className="text-xs">Order: {t.sort_order}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingTestimonial({ ...t }); setTestimonialDialogOpen(true); }}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteTestimonialConfirm({ id: t.id, name: t.name })}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {!testimonials?.length && <p className="text-muted-foreground text-sm">No testimonials yet.</p>}
        </div>
      </div>

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-card border-border/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-section-dark-foreground">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Plan
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteConfirm) {
                  deletePlan.mutate(deleteConfirm.id);
                  setDeleteConfirm(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Plan Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border/20 text-section-dark-foreground max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">{editingPlan?.id ? "Edit Plan" : "New Plan"}</DialogTitle>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-5">
              {/* Plan Name */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-muted-foreground">Plan Name</Label>
                <Input
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  placeholder="e.g. Premium Plan"
                  className="bg-background/5 border-border/20"
                />
              </div>

              {/* Details */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-muted-foreground">Details</Label>
                <textarea
                  value={editingPlan.details}
                  onChange={(e) => setEditingPlan({ ...editingPlan, details: e.target.value })}
                  placeholder="Brief description of this plan shown to users"
                  rows={3}
                  className="flex w-full rounded-md border border-border/20 bg-background/5 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Amount Range */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Investment Range ($)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground/70">Minimum</span>
                    <Input type="number" value={editingPlan.min_amount} onChange={(e) => setEditingPlan({ ...editingPlan, min_amount: +e.target.value })} className="bg-background/5 border-border/20" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground/70">Maximum</span>
                    <Input type="number" value={editingPlan.max_amount} onChange={(e) => setEditingPlan({ ...editingPlan, max_amount: +e.target.value })} className="bg-background/5 border-border/20" />
                  </div>
                </div>
              </div>

              {/* Returns */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Returns</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground/70">ROI Percentage</span>
                    <Input type="number" value={editingPlan.roi_percentage} onChange={(e) => setEditingPlan({ ...editingPlan, roi_percentage: +e.target.value })} className="bg-background/5 border-border/20" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground/70">Duration (days)</span>
                    <Input type="number" value={editingPlan.duration_days} onChange={(e) => setEditingPlan({ ...editingPlan, duration_days: +e.target.value })} className="bg-background/5 border-border/20" />
                  </div>
                </div>
              </div>

              {/* ROI Frequency */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">ROI Payout Frequency (days)</Label>
                <Input type="number" min={1} value={editingPlan.roi_frequency_days} onChange={(e) => setEditingPlan({ ...editingPlan, roi_frequency_days: Math.max(1, +e.target.value) })} className="bg-background/5 border-border/20 max-w-xs" />
                <p className="text-xs text-muted-foreground/70">1 = daily, 7 = weekly, etc.</p>
              </div>

              <Separator className="border-border/10" />

              {/* Popular Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-border/10 p-3">
                <div>
                  <Label className="text-sm font-medium">Mark as Popular</Label>
                  <p className="text-xs text-muted-foreground">Highlights this plan for users</p>
                </div>
                <Switch checked={editingPlan.is_popular} onCheckedChange={(v) => setEditingPlan({ ...editingPlan, is_popular: v })} />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Type a feature and press Enter"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    className="bg-background/5 border-border/20"
                  />
                  <Button type="button" size="sm" variant="secondary" onClick={addFeature}>Add</Button>
                </div>
                {editingPlan.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingPlan.features.map((f, i) => (
                      <span key={i} className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        {f}
                        <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" onClick={() => removeFeature(i)} />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => editingPlan && savePlan.mutate(editingPlan)} disabled={savePlan.isPending}>
              {savePlan.isPending ? "Saving..." : "Save Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Wallet Dialog */}
      <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
        <DialogContent className="bg-card border-border/20 text-section-dark-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingWallet.id ? "Edit Wallet" : "New Wallet Address"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-muted-foreground">Label</Label>
              <Input value={editingWallet.label} onChange={(e) => setEditingWallet({ ...editingWallet, label: e.target.value })} placeholder="e.g. Bitcoin Main" className="bg-background/5 border-border/20" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-muted-foreground">Network</Label>
              <Select value={editingWallet.network} onValueChange={(v) => setEditingWallet({ ...editingWallet, network: v })}>
                <SelectTrigger className="bg-background/5 border-border/20">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {CRYPTO_NETWORKS.map((n) => (
                    <SelectItem key={n.value} value={n.value}>
                      <span className="flex items-center gap-2">
                        <img src={n.logo} alt={n.label} className="h-4 w-4 rounded-full" />
                        {n.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-muted-foreground">Wallet Address</Label>
              <Input value={editingWallet.address} onChange={(e) => setEditingWallet({ ...editingWallet, address: e.target.value })} placeholder="Paste wallet address" className="bg-background/5 border-border/20 font-mono text-xs" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/10 p-3">
              <div>
                <Label className="text-sm font-medium">Active</Label>
                <p className="text-xs text-muted-foreground">Only active wallets are shown to users</p>
              </div>
              <Switch checked={editingWallet.is_active} onCheckedChange={(v) => setEditingWallet({ ...editingWallet, is_active: v })} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setWalletDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => saveWallet.mutate(editingWallet)} disabled={saveWallet.isPending}>
              {saveWallet.isPending ? "Saving..." : "Save Wallet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Wallet Confirmation */}
      <AlertDialog open={!!deleteWalletConfirm} onOpenChange={(open) => !open && setDeleteWalletConfirm(null)}>
        <AlertDialogContent className="bg-card border-border/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-section-dark-foreground">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Wallet
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteWalletConfirm?.label}</strong>? Users will no longer see this address.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteWalletConfirm) {
                  deleteWallet.mutate(deleteWalletConfirm.id);
                  setDeleteWalletConfirm(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Testimonial Dialog */}
      <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
        <DialogContent className="bg-card border-border/20 text-section-dark-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTestimonial.id ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                <Input value={editingTestimonial.name} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })} placeholder="John D." className="bg-background/5 border-border/20" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                <Input value={editingTestimonial.role} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })} placeholder="Investor" className="bg-background/5 border-border/20" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-muted-foreground">Testimonial Text</Label>
              <textarea
                value={editingTestimonial.text}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                placeholder="What the investor said..."
                rows={3}
                className="flex w-full rounded-md border border-border/20 bg-background/5 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-muted-foreground">Rating (1-5)</Label>
                <Input type="number" min={1} max={5} value={editingTestimonial.rating} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Math.min(5, Math.max(1, +e.target.value)) })} className="bg-background/5 border-border/20" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-muted-foreground">Sort Order</Label>
                <Input type="number" min={0} value={editingTestimonial.sort_order} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, sort_order: +e.target.value })} className="bg-background/5 border-border/20" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/10 p-3">
              <div>
                <Label className="text-sm font-medium">Active</Label>
                <p className="text-xs text-muted-foreground">Only active testimonials are shown on the site</p>
              </div>
              <Switch checked={editingTestimonial.is_active} onCheckedChange={(v) => setEditingTestimonial({ ...editingTestimonial, is_active: v })} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setTestimonialDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => saveTestimonial.mutate(editingTestimonial)} disabled={saveTestimonial.isPending}>
              {saveTestimonial.isPending ? "Saving..." : "Save Testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Testimonial Confirmation */}
      <AlertDialog open={!!deleteTestimonialConfirm} onOpenChange={(open) => !open && setDeleteTestimonialConfirm(null)}>
        <AlertDialogContent className="bg-card border-border/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-section-dark-foreground">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Testimonial
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the testimonial from <strong>{deleteTestimonialConfirm?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTestimonialConfirm) {
                  deleteTestimonial.mutate(deleteTestimonialConfirm.id);
                  setDeleteTestimonialConfirm(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
