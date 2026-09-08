import { PrivyProvider, usePrivy, useLogin } from "@privy-io/react-auth";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { exchangePrivyToken, PRIVY_APP_ID } from "@/lib/privy.functions";

function PrivyButton() {
  const navigate = useNavigate();
  const { getAccessToken, user, logout } = usePrivy();
  const [busy, setBusy] = useState(false);

  async function bridge() {
    setBusy(true);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sem sessão Privy.");
      const emailValue = user?.email?.address ?? user?.google?.email ?? undefined;
      const res = await exchangePrivyToken({
        data: { accessToken, ...(emailValue ? { email: emailValue } : {}) },
      });
      const { error } = await supabase.auth.verifyOtp({
        type: "email",
        token_hash: res.tokenHash,
      });
      if (error) throw error;
      navigate({ to: "/carteira" });
    } catch (e) {
      await logout().catch(() => undefined);
      toast.error(e instanceof Error ? e.message : "Não foi possível entrar com a Privy.");
    } finally {
      setBusy(false);
    }
  }

  const { login } = useLogin({ onComplete: () => void bridge() });

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={busy}
      onClick={() => (user ? void bridge() : login())}
    >
      {busy ? "A ligar..." : "Continuar com Privy"}
    </Button>
  );
}

export default function PrivyLogin() {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: { theme: "dark", accentColor: "#10b981", walletChainType: "ethereum-only" },
        embeddedWallets: { ethereum: { createOnLogin: "users-without-wallets" } },
      }}
    >
      <PrivyButton />
    </PrivyProvider>
  );
}
