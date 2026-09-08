import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const PRIVY_APP_ID = "cmtrujsgl00rs0dkzgqx8uojl";

/**
 * Verifies a Privy access token (via Privy's public JWKS) and returns a
 * one-time Supabase token so the browser can open a real session.
 */
export const exchangePrivyToken = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ accessToken: z.string().min(10), email: z.string().email().optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { createRemoteJWKSet, jwtVerify } = await import("jose");

    const jwks = createRemoteJWKSet(
      new URL(`https://auth.privy.io/api/v1/apps/${PRIVY_APP_ID}/jwks.json`),
    );

    let subject: string;
    try {
      const { payload } = await jwtVerify(data.accessToken, jwks, {
        issuer: "privy.io",
        audience: PRIVY_APP_ID,
      });
      subject = String(payload.sub ?? "");
    } catch {
      throw new Error("Sessão Privy inválida. Tente entrar novamente.");
    }
    if (!subject) throw new Error("Sessão Privy inválida.");

    const email = data.email ?? `${subject.replace(/[^a-zA-Z0-9]/g, "")}@privy.kwanzapay.app`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    async function magicLink() {
      return supabaseAdmin.auth.admin.generateLink({ type: "magiclink", email });
    }

    let link = await magicLink();
    if (link.error) {
      const created = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { privy_did: subject, full_name: email.split("@")[0] },
      });
      if (created.error && !/already/i.test(created.error.message)) {
        throw new Error("Não foi possível criar a sua conta kwanzapay.");
      }
      link = await magicLink();
    }

    const hashed = link.data?.properties?.hashed_token;
    if (link.error || !hashed) {
      throw new Error("Não foi possível iniciar a sessão. Tente novamente.");
    }

    return { email, tokenHash: hashed };
  });
