import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  LogOut,
  Plus,
  Send,
  Wallet as WalletIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getOverview, depositFunds, sendFunds, withdrawFunds } from "@/lib/wallet.functions";

export const Route = createFileRoute("/_authenticated/carteira")({
  head: () => ({
    meta: [
      { title: "A minha carteira | kwanzapay" },
      {
        name: "description",
        content: "Consulte saldos, envie e receba dinheiro e acompanhe todas as suas transações kwanzapay.",
      },
      { property: "og:title", content: "A minha carteira | kwanzapay" },
      { property: "og:description", content: "Saldos, envios e histórico de transações da sua conta kwanzapay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CarteiraPage,
});

const currencies = ["AOA", "USD", "USDT"] as const;

function formatMoney(value: number, currency: string) {
  const locale = currency === "AOA" ? "pt-AO" : "en-US";
  const formatted = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  return `${formatted} ${currency}`;
}

function CarteiraPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchOverview = useServerFn(getOverview);
  const deposit = useServerFn(depositFunds);
  const send = useServerFn(sendFunds);
  const withdraw = useServerFn(withdrawFunds);

  const { data, isLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: () => fetchOverview(),
  });

  const [busy, setBusy] = useState(false);
  const [openDialog, setOpenDialog] = useState<null | "deposit" | "send" | "withdraw">(null);

  const wallets = data?.wallets ?? [];
  const primary = wallets[0];

  async function run(action: () => Promise<{ reference: string }>, successMsg: string) {
    setBusy(true);
    try {
      const res = await action();
      toast.success(`${successMsg} Referência ${res.reference}`);
      setOpenDialog(null);
      await queryClient.invalidateQueries({ queryKey: ["overview"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Operação falhou.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold tracking-tight">
            kwanza<span className="text-primary">pay</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut();
              queryClient.clear();
              navigate({ to: "/auth" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-8 px-4 pt-8">
        <section className="rounded-3xl border border-border bg-gradient-to-br from-card to-secondary p-8">
          <p className="text-sm text-muted-foreground">
            Olá{data?.profile?.full_name ? `, ${data.profile.full_name.split(" ")[0]}` : ""} — saldo disponível
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            {isLoading ? "—" : formatMoney(primary?.balance ?? 0, primary?.currency ?? "AOA")}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ActionButton icon={<Plus className="h-4 w-4" />} label="Depositar" onClick={() => setOpenDialog("deposit")} />
            <ActionButton icon={<Send className="h-4 w-4" />} label="Enviar" onClick={() => setOpenDialog("send")} />
            <ActionButton icon={<Banknote className="h-4 w-4" />} label="Levantar" onClick={() => setOpenDialog("withdraw")} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">As minhas contas</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {wallets.map((w) => (
              <div key={w.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <WalletIcon className="h-4 w-4" /> {w.currency}
                </div>
                <p className="mt-3 text-xl font-semibold">{formatMoney(w.balance, w.currency)}</p>
              </div>
            ))}
            {!isLoading && wallets.length === 0 && (
              <p className="text-sm text-muted-foreground">Ainda não tem contas ativas.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Movimentos recentes</h2>
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {isLoading && <p className="p-5 text-sm text-muted-foreground">A carregar...</p>}
            {!isLoading && (data?.transactions.length ?? 0) === 0 && (
              <p className="p-5 text-sm text-muted-foreground">Sem movimentos por enquanto.</p>
            )}
            {data?.transactions.map((t) => {
              const incoming = t.type === "deposit" || t.type === "receive";
              return (
                <div key={t.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      {incoming ? (
                        <ArrowDownLeft className="h-4 w-4 text-primary" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-accent" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{t.description ?? t.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.created_at).toLocaleString("pt-AO")} · {t.reference}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${incoming ? "text-primary" : "text-foreground"}`}>
                      {incoming ? "+" : "-"}
                      {formatMoney(t.amount, t.currency)}
                    </p>
                    <Badge variant="secondary" className="mt-1 text-[10px]">
                      {t.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <MoneyDialog
        open={openDialog === "deposit"}
        onOpenChange={(o) => setOpenDialog(o ? "deposit" : null)}
        title="Depositar dinheiro"
        busy={busy}
        extraLabel="Método"
        extraPlaceholder="Transferência bancária"
        submitLabel="Confirmar depósito"
        onSubmit={(currency, amount, extra) =>
          run(() => deposit({ data: { currency, amount, method: extra } }), "Depósito concluído.")
        }
      />
      <MoneyDialog
        open={openDialog === "send"}
        onOpenChange={(o) => setOpenDialog(o ? "send" : null)}
        title="Enviar dinheiro"
        busy={busy}
        extraLabel="Email de quem recebe"
        extraPlaceholder="nome@email.com"
        submitLabel="Enviar agora"
        onSubmit={(currency, amount, extra) =>
          run(() => send({ data: { currency, amount, recipientEmail: extra } }), "Envio concluído.")
        }
      />
      <MoneyDialog
        open={openDialog === "withdraw"}
        onOpenChange={(o) => setOpenDialog(o ? "withdraw" : null)}
        title="Levantar dinheiro"
        busy={busy}
        extraLabel="IBAN ou endereço de destino"
        extraPlaceholder="AO06 0000 0000 0000 0000 0"
        submitLabel="Pedir levantamento"
        onSubmit={(currency, amount, extra) =>
          run(() => withdraw({ data: { currency, amount, destination: extra } }), "Pedido registado.")
        }
      />
    </main>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Button onClick={onClick} className="rounded-full">
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  );
}

function MoneyDialog({
  open,
  onOpenChange,
  title,
  extraLabel,
  extraPlaceholder,
  submitLabel,
  busy,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  extraLabel: string;
  extraPlaceholder: string;
  submitLabel: string;
  busy: boolean;
  onSubmit: (currency: "AOA" | "USD" | "USDT", amount: number, extra: string) => void;
}) {
  const [currency, setCurrency] = useState<"AOA" | "USD" | "USDT">("AOA");
  const [amount, setAmount] = useState("");
  const [extra, setExtra] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const value = Number(amount);
            if (!Number.isFinite(value) || value <= 0) {
              toast.error("Indique um valor válido.");
              return;
            }
            onSubmit(currency, value, extra.trim());
          }}
        >
          <Tabs value={currency} onValueChange={(v) => setCurrency(v as typeof currency)}>
            <TabsList className="grid w-full grid-cols-3">
              {currencies.map((c) => (
                <TabsTrigger key={c} value={c}>
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="extra">{extraLabel}</Label>
            <Input id="extra" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder={extraPlaceholder} required />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "A processar..." : submitLabel}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

