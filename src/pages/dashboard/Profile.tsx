import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { User, MapPin, Phone, Calendar, Globe, FileText } from "lucide-react";

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
      setDateOfBirth((profile as any).date_of_birth ?? "");
      setGender((profile as any).gender ?? "");
      setCountry((profile as any).country ?? "");
      setCity((profile as any).city ?? "");
      setAddress((profile as any).address ?? "");
      setBio((profile as any).bio ?? "");
    }
  }, [profile]);

  const update = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          date_of_birth: dateOfBirth || null,
          gender: gender || null,
          country: country.trim() || null,
          city: city.trim() || null,
          address: address.trim() || null,
          bio: bio.trim() || null,
        } as any)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("dashboard.profile.profileUpdated"));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => toast.error(t("dashboard.profile.updateFailed")),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-section-dark-foreground mb-6">
        {t("dashboard.profile.title")}
      </h1>

      <div className="grid gap-6 max-w-2xl">
        {/* Personal Information */}
        <Card className="bg-card/5 border-border/10">
          <CardHeader>
            <CardTitle className="text-section-dark-foreground text-lg flex items-center gap-2">
              <User size={18} className="text-primary" />
              {t("dashboard.profile.personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">{t("dashboard.profile.email")}</label>
              <Input
                value={user?.email ?? ""}
                disabled
                className="bg-background/5 border-border/20 text-muted-foreground"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">{t("dashboard.profile.fullName")}</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-background/10 border-border/20 text-section-dark-foreground"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">{t("dashboard.profile.phone")}</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 890"
                  className="bg-background/10 border-border/20 text-section-dark-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1.5">
                  <Calendar size={14} /> Date of Birth
                </label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="bg-background/10 border-border/20 text-section-dark-foreground"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Gender</label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="bg-background/10 border-border/20 text-section-dark-foreground">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="bg-card/5 border-border/10">
          <CardHeader>
            <CardTitle className="text-section-dark-foreground text-lg flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1.5">
                  <Globe size={14} /> Country
                </label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  className="bg-background/10 border-border/20 text-section-dark-foreground"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">City</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  className="bg-background/10 border-border/20 text-section-dark-foreground"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Apt 4B"
                className="bg-background/10 border-border/20 text-section-dark-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="bg-card/5 border-border/10">
          <CardHeader>
            <CardTitle className="text-section-dark-foreground text-lg flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              About You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself..."
              rows={4}
              className="bg-background/10 border-border/20 text-section-dark-foreground"
            />
          </CardContent>
        </Card>

        <Button onClick={() => update.mutate()} disabled={update.isPending} className="w-fit">
          {t("dashboard.profile.saveChanges")}
        </Button>
      </div>
    </div>
  );
}
