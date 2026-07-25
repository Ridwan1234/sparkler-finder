import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type AuthorizationDetails = {
  client?: { name?: string; logo_uri?: string } | null;
  scopes?: string[] | null;
  redirect_url?: string;
  redirect_to?: string;
};

// Beta typing shim for supabase.auth.oauth
type OAuthApi = {
  getAuthorizationDetails: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

function oauthApi(): OAuthApi {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase.auth as any).oauth as OAuthApi;
}

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Missing authorization_id");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const api = oauthApi();
    const { data, error } = approve
      ? await api.approveAuthorization(authorizationId)
      : await api.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      return setError(error.message);
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("No redirect returned by the authorization server.");
    }
    window.location.href = target;
  }

  if (error) {
    return (
      <main className="min-h-screen section-dark flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card/5 border border-border/10 rounded-2xl p-8 text-section-dark-foreground">
          <h1 className="font-display text-xl font-bold mb-2">Authorization error</h1>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </main>
    );
  }

  if (!details) {
    return (
      <main className="min-h-screen section-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const name = details.client?.name ?? "an app";

  return (
    <main className="min-h-screen section-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card/5 border border-border/10 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-lg">H</span>
          </div>
          <span className="font-display font-bold text-xl text-section-dark-foreground">HarborForge</span>
        </div>

        <h1 className="font-display text-2xl font-bold text-section-dark-foreground mb-2">
          Connect {name} to your account
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          {name} is requesting access to act as you in HarborForge. It will be able to read your
          profile, balance, deposits, withdrawals, investments, and transactions.
        </p>

        <div className="flex gap-3">
          <Button
            className="flex-1"
            disabled={busy}
            onClick={() => decide(true)}
          >
            {busy ? "Working…" : "Approve"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-border/20 text-section-dark-foreground"
            disabled={busy}
            onClick={() => decide(false)}
          >
            Deny
          </Button>
        </div>
      </div>
    </main>
  );
}
