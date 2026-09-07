import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const amount = z.number().positive().max(1_000_000_000);
const currency = z.enum(["AOA", "USD", "USDT"]);

export type Wallet = {
  id: string;
  currency: string;
  balance: number;
  is_primary: boolean;
};

export type Transaction = {
  id: string;
  reference: string;
  type: string;
  status: string;
  currency: string;
  amount: number;
  fee: number;
  description: string | null;
  created_at: string;
};

export const getOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [profile, wallets, transactions] = await Promise.all([
      supabase.from("profiles").select("full_name, preferred_currency, kyc_status").eq("id", userId).maybeSingle(),
      supabase.from("wallets").select("id, currency, balance, is_primary").eq("user_id", userId).order("is_primary", { ascending: false }),
      supabase
        .from("transactions")
        .select("id, reference, type, status, currency, amount, fee, description, created_at")
        .order("created_at", { ascending: false })
        .limit(25),
    ]);

    return {
      profile: profile.data ?? null,
      wallets: (wallets.data ?? []).map((w) => ({ ...w, balance: Number(w.balance) })) as Wallet[],
      transactions: (transactions.data ?? []).map((t) => ({
        ...t,
        amount: Number(t.amount),
        fee: Number(t.fee),
      })) as Transaction[],
    };
  });

function friendlyError(message: string) {
  switch (message) {
    case "insufficient_funds":
      return "Saldo insuficiente para esta operação.";
    case "recipient_not_found":
      return "Não existe nenhuma conta kwanzapay com esse email.";
    case "self_transfer":
      return "Não pode enviar dinheiro para si próprio.";
    case "invalid_amount":
      return "Valor inválido.";
    default:
      return "Não foi possível concluir a operação. Tente novamente.";
  }
}

async function callMoneyRpc(fn: string, args: Record<string, unknown>) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc(fn as never, args as never);
  if (error) {
    const raw = (error.message || "").match(/insufficient_funds|recipient_not_found|self_transfer|invalid_amount/)?.[0] ?? "";
    throw new Error(friendlyError(raw));
  }
  return data as unknown as { reference: string };
}

export const depositFunds = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ currency, amount, method: z.string().min(2).max(40) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const tx = await callMoneyRpc("perform_deposit", {
      p_user: context.userId,
      p_currency: data.currency,
      p_amount: data.amount,
      p_description: `Depósito via ${data.method}`,
    });
    return { reference: tx.reference };
  });

export const sendFunds = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        currency,
        amount,
        recipientEmail: z.string().email(),
        note: z.string().max(140).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const tx = await callMoneyRpc("perform_transfer", {
      p_sender: context.userId,
      p_recipient_email: data.recipientEmail,
      p_currency: data.currency,
      p_amount: data.amount,
      p_description: data.note ?? "Envio kwanzapay",
    });
    return { reference: tx.reference };
  });

export const withdrawFunds = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ currency, amount, destination: z.string().min(3).max(120) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const tx = await callMoneyRpc("request_withdrawal", {
      p_user: context.userId,
      p_currency: data.currency,
      p_amount: data.amount,
      p_destination: data.destination,
    });
    return { reference: tx.reference };
  });
