import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Zap, Globe2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "kwanzapay | Carteira digital para kwanzas e stablecoins" },
      {
        name: "description",
        content:
          "kwanzapay é a carteira digital angolana para guardar, enviar e receber kwanzas e stablecoins em segundos, com segurança e registo completo de cada movimento.",
      },
      { property: "og:title", content: "kwanzapay | Carteira digital angolana" },
      {
        property: "og:description",
        content: "Guarde, envie e receba kwanzas e stablecoins em segundos, com total segurança.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <span className="text-xl font-bold tracking-tight">
          kwanza<span className="text-primary">pay</span>
        </span>
        <Link to="/auth">
          <Button variant="secondary" className="rounded-full">
            Entrar
          </Button>
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-14 pb-20">
        <p className="mb-4 inline-flex rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          Kwanzas e stablecoins numa só conta
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          O seu dinheiro digital, <span className="text-primary">sem fronteiras</span>.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Guarde, envie e receba dinheiro em segundos. Cada movimento fica registado num livro-razão seguro,
          para o saldo bater sempre certo.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/auth">
            <Button size="lg" className="rounded-full">
              Criar conta grátis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          <Feature icon={<Zap className="h-5 w-5 text-primary" />} title="Instantâneo" text="Envios entre contas kwanzapay chegam de imediato, sem taxas escondidas." />
          <Feature icon={<ShieldCheck className="h-5 w-5 text-primary" />} title="Seguro" text="Saldos só mudam através de operações verificadas no servidor." />
          <Feature icon={<Globe2 className="h-5 w-5 text-primary" />} title="Multi-moeda" text="Kwanzas, dólares e USDT lado a lado na mesma carteira." />
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} kwanzapay
      </footer>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">{icon}</div>
      <h2 className="mt-4 text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
