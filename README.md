# Kwanzapay Digital Wallet

Claro. Vou consolidar tudo em um único prompt final, já com o Privy App ID que forneceste. A ideia é o gerador de código entender que deve construir uma carteira crypto funcional, e não um simples site institucional.

Crie uma plataforma profissional de carteira digital de criptomoedas chamada kwanzapay, com experiência moderna semelhante a carteiras e plataformas de pagamentos crypto como Airtm e RedotPay, mas com identidade visual, arquitetura e código próprios.

OBJETIVO PRINCIPAL

Criar uma carteira digital onde qualquer utilizador possa:

criar uma conta

fazer login

receber uma wallet crypto

armazenar USDT

armazenar USDC

depositar USDT

depositar USDC

enviar USDT

enviar USDC

receber USDT

receber USDC

transferir crypto para outros utilizadores da plataforma

trocar USDT por USDC

trocar USDC por USDT

levantar USDT

levantar USDC

consultar o histórico completo das operações

gerir a segurança da conta

A plataforma deve utilizar Privy para autenticação e infraestrutura de wallets.

Os ativos iniciais são exclusivamente:

USDT

USDC



1. STACK TECNOLÓGICA

Utilizar:

Next.js

React

TypeScript

Tailwind CSS

shadcn/ui

Node.js

Supabase PostgreSQL

Privy

APIs REST

Webhooks

Blockchain

Arquitetar o sistema de forma modular e escalável.

Separar claramente:

Frontend

Backend

Database

Authentication

Wallet

Blockchain

Ledger

Security

Admin

2. PRIVY

Integrar a aplicação com Privy.

App ID:

cmtrujsgl00rs0dkzgqx8uojl

Utilizar o App ID através de variável de ambiente:

NEXT_PUBLIC_PRIVY_APP_ID

Não colocar secrets privados no código.

Não expor private keys.

Utilizar a documentação e SDK atual da Privy para implementar corretamente:

autenticação

embedded wallets

criação/associação de wallets

assinatura de operações

gestão das wallets

transações

Não inventar APIs ou métodos da Privy. Utilizar somente APIs suportadas pela versão atual do SDK instalada no projeto.

3. LOGIN E REGISTRO

Criar uma experiência simples.

Página inicial:

Bem-vindo à [NOME DA PLATAFORMA]

Botão:

Começar

Permitir login através dos métodos disponibilizados pela Privy, como:

Google

Email

Telefone

Passkey, quando disponível

Depois do login:

Privy
↓
Identificar utilizador
↓
Criar/associar wallet
↓
Criar perfil no Supabase
↓
Dashboard

Cada utilizador deve possuir um identificador único.

4. DASHBOARD

Criar um dashboard premium.

Mostrar:

Olá, [Nome]

Saldo total

Exemplo:

$1,250.00

Cards:

USDT

500.00 USDT

USDC

750.00 USDC

Botões:

Depositar

Enviar

Receber

Trocar

Levantar

Adicionar:

gráfico de saldo

últimas transações

atividade recente

notificações

atalhos

estado da segurança

5. WALLET

Criar:

/wallet

Mostrar todos os ativos.

USDT

Saldo:

500.00 USDT

USDC

Saldo:

750.00 USDC

Cada ativo deve apresentar:

saldo

endereço

rede

QR Code

histórico

depositar

receber

enviar

levantar

A arquitetura deve permitir adicionar novos tokens e redes no futuro.

6. DEPÓSITO

Criar:

/deposit

Fluxo:

Selecionar ativo:

USDT / USDC

↓

Selecionar rede

↓

Mostrar endereço

↓

Mostrar QR Code

↓

Botão:

Copiar endereço

Mostrar claramente:

Ativo: USDT

Rede: [REDE]

Endereço: ...

Adicionar aviso:

Envie somente o ativo e a rede selecionados para este endereço.

Quando o utilizador fizer um depósito:

Blockchain
↓
Detectar transação
↓
Verificar transação
↓
Verificar ativo
↓
Verificar rede
↓
Verificar endereço
↓
Verificar quantidade
↓
Aguardar confirmações necessárias
↓
Registrar no ledger
↓
Atualizar saldo
↓
Notificar utilizador

Nunca creditar fundos somente com base em informação enviada pelo frontend.

7. RECEBER

Criar:

/receive

Permitir:

USDT

USDC

Depois:

Selecionar rede.

Mostrar:

endereço

QR Code

copiar endereço

compartilhar

Adicionar explicação clara sobre a rede escolhida.

8. ENVIAR

Criar:

/send

Fluxo:

Selecionar ativo

↓

USDT / USDC

↓

Selecionar rede

↓

Inserir endereço

↓

Inserir quantidade

↓

Revisar

↓

Confirmar

Exemplo:

Você envia:

100 USDT

Taxa:

X USDT

Total:

X USDT

Destino:

0x...

Antes de executar, o backend deve verificar novamente:

utilizador autenticado

saldo disponível

ativo

rede

endereço

quantidade

taxa

limites

autorização

estado da wallet

Nunca confiar nos valores calculados pelo frontend.

9. TRANSFERÊNCIAS INTERNAS

Permitir que utilizadores da própria plataforma enviem USDT ou USDC entre si.

Exemplo:

Evaristo

↓

50 USDT

↓

João

Se ambos forem utilizadores internos, utilizar o ledger interno quando apropriado, evitando uma transação blockchain desnecessária.

Exemplo:

Utilizador A:

500 USDT

Envia:

50 USDT

Novo saldo:

450 USDT

Utilizador B:

100 USDT

Recebe:

50 USDT

Novo saldo:

150 USDT

Criar ID único:

TRX-82931

Registrar:

remetente

destinatário

ativo

quantidade

taxa

data

status

referência

10. TROCA USDT / USDC

Criar:

/swap

Permitir:

USDT → USDC

USDC → USDT

Interface:

Você envia

100 USDT

Taxa

X

Taxa de câmbio

1 USDT = X USDC

Você recebe

X USDC

Antes de executar:

obter cotação

validar cotação

calcular taxa

verificar saldo

confirmar operação

registrar no ledger

Não permitir que o frontend determine sozinho o valor final da operação.

11. LEVANTAMENTO

Criar:

/withdraw

Permitir:

USDT

USDC

Fluxo:

Selecionar ativo

↓

Selecionar rede

↓

Inserir endereço

↓

Inserir valor

↓

Revisar

↓

Confirmar

Mostrar:

Valor

Taxa

Total

Rede

Endereço

Status

Implementar:

limites

validação de endereço

autenticação adicional

proteção antifraude

confirmação para operações sensíveis

logs

idempotência

12. HISTÓRICO

Criar:

/transactions

Filtros:

Todos

Depósitos

Levantamentos

Transferências

Swaps

Cada transação deve apresentar:

ID

tipo

ativo

quantidade

taxa

status

data

hora

rede

hash blockchain

endereço de origem

endereço de destino

Status:

Pending

Processing

Completed

Failed

Cancelled

Permitir abrir uma transação para visualizar todos os detalhes.

13. LEDGER

Criar um sistema financeiro interno baseado em double-entry ledger.

Nunca simplesmente modificar o saldo diretamente.

Exemplo:

Transferência de 100 USDT:

Conta A:

-100 USDT

Conta B:

+100 USDT

A operação deve ser atômica.

Implementar:

idempotência

reconciliação

auditoria

prevenção de double spending

prevenção de duplicação

histórico imutável das entradas financeiras

Criar mecanismo para comparar:

Saldo do ledger

vs.

Saldo observado na blockchain

e identificar discrepâncias.

14. SUPABASE

Criar banco de dados PostgreSQL utilizando Supabase.

Tabelas:

users

profiles

privy_users

wallets

wallet_addresses

assets

networks

balances

ledger_accounts

ledger_entries

transactions

deposits

withdrawals

transfers

internal_transfers

swaps

fees

limits

security_events

audit_logs

notifications

Criar relacionamentos e índices apropriados.

Utilizar:

Row Level Security (RLS)

Um utilizador nunca deve conseguir acessar dados financeiros de outro utilizador.

15. PAINEL ADMINISTRATIVO

Criar:

/admin

Dashboard com:

utilizadores

wallets

USDT armazenado

USDC armazenado

depósitos

levantamentos

transferências

swaps

volume total

operações pendentes

alertas de segurança

Menu:

Dashboard

Utilizadores

Wallets

Transações

Depósitos

Levantamentos

Transferências

Swaps

Taxas

Limites

Segurança

Logs

Configurações

16. ADMIN — UTILIZADORES

Mostrar:

ID

nome

email

data de criação

wallet

saldo

status

último login

Permitir:

visualizar

bloquear

desbloquear

suspender operações

consultar histórico

Nenhum administrador deve conseguir alterar saldo diretamente sem criar uma operação administrativa auditável.

17. SEGURANÇA

Implementar:

autenticação Privy

autorização backend

rate limiting

validação de dados

idempotency keys

logs

auditoria

proteção contra double spending

proteção contra transações duplicadas

proteção contra acesso não autorizado

confirmação para operações sensíveis

Nunca:

colocar private keys no frontend

colocar secrets no GitHub

expor credenciais

confiar no saldo enviado pelo cliente

confiar em valores enviados pelo frontend

creditar depósitos sem confirmação blockchain

permitir execução duplicada da mesma operação

Utilizar variáveis de ambiente para todas as credenciais.

18. WEBHOOKS

Criar sistema de processamento de eventos.

Fluxo:

Evento blockchain

↓

Webhook

↓

Validar evento

↓

Verificar transação

↓

Verificar rede

↓

Verificar ativo

↓

Verificar endereço

↓

Verificar quantidade

↓

Verificar confirmações

↓

Ledger

↓

Saldo

↓

Notificação

O processamento deve ser idempotente.

O mesmo depósito nunca pode ser creditado duas vezes.

19. NOTIFICAÇÕES

Criar notificações para:

depósito recebido

depósito confirmado

transferência enviada

transferência recebida

swap concluído

levantamento solicitado

levantamento processado

levantamento concluído

levantamento recusado

novo login

novo dispositivo

alteração de segurança

atividade suspeita

20. PERFIL

Criar:

/profile

Mostrar:

nome

email

telefone

ID

wallet

data de criação

Opções:

editar perfil

segurança

dispositivos

sessões

notificações

21. SEGURANÇA DA CONTA

Criar:

/security

Mostrar:

sessões ativas

dispositivos

atividade recente

método de autenticação

MFA

passkeys

confirmações

alertas

Permitir terminar sessões de outros dispositivos.

22. DESIGN

Criar uma interface de fintech crypto premium.

Tema principal:

preto

azul escuro

branco

azul como destaque

Características:

design moderno

minimalista

elegante

profissional

cards premium

bordas arredondadas

glassmorphism discreto

animações suaves

gráficos

ícones modernos

excelente responsividade

O design deve funcionar perfeitamente em:

Desktop

Tablet

Android

iPhone

Criar identidade visual própria.

Não copiar diretamente nenhuma plataforma existente.

23. MENU

Dashboard

Wallet

Depositar

Enviar

Receber

Trocar

Levantar

Histórico

Segurança

Perfil

Suporte

24. ESTRUTURA DO PROJETO

Organizar:

/app

/dashboard

/wallet

/deposit

/withdraw

/send

/receive

/swap

/transactions

/security

/profile

/admin

/api

/components

/lib

/services

/database

/types

/utils

/middleware

Criar componentes reutilizáveis.

Separar:

Frontend

Backend

Services

Database

Blockchain

Privy

Ledger

Security

25. EXPERIÊNCIA DO UTILIZADOR

A experiência deve ser extremamente simples.

Depositar

Wallet

↓

Depositar

↓

USDT/USDC

↓

Rede

↓

Endereço + QR Code

Enviar

Enviar

↓

USDT/USDC

↓

Endereço

↓

Valor

↓

Revisar

↓

Confirmar

Receber

Receber

↓

USDT/USDC

↓

Rede

↓

QR Code + endereço

Trocar

Trocar

↓

USDT/USDC

↓

Quantidade

↓

Cotação

↓

Confirmar

Levantar

Levantar

↓

USDT/USDC

↓

Rede

↓

Endereço

↓

Valor

↓

Confirmar

26. RESPONSIVIDADE

No desktop utilizar sidebar.

No mobile utilizar navegação inferior:

Home

Wallet

Enviar

Receber

Histórico

Criar também botão flutuante para ações rápidas quando apropriado.

27. QUALIDADE DO CÓDIGO

O código deve ser:

TypeScript strict

modular

limpo

documentado

escalável

seguro

Evitar:

código duplicado

lógica financeira no frontend

secrets hardcoded

queries inseguras

funções gigantes

componentes monolíticos

Adicionar tratamento de erros.

Criar páginas de:

loading

error

success

pending

empty state

28. VARIÁVEIS DE AMBIENTE

Criar .env.example.

Exemplo:

NEXT_PUBLIC_PRIVY_APP_ID=cmtrujsgl00rs0dkzgqx8uojl

Adicionar placeholders para:

Supabase

Privy

blockchain providers

serviços de cotação

serviços de webhook

Nunca colocar secrets reais no código-fonte.

29. RESULTADO FINAL

O produto final deve funcionar como uma verdadeira carteira crypto.

Fluxo principal:

CRIAR CONTA

↓

PRIVY

↓

WALLET

↓

DASHBOARD

↓

USDT / USDC

↓

DEPOSITAR

↓

ARMAZENAR

↓

ENVIAR

↓

RECEBER

↓

TRANSFERIR

↓

TROCAR

↓

LEVANTAR

↓

HISTÓRICO

A plataforma deve ser construída pensando primeiro em USDT e USDC, mas sua arquitetura deve permitir adicionar outras criptomoedas e redes posteriormente.

Priorizar:

Segurança

Privacidade

Experiência do utilizador

Integridade do ledger

Confiabilidade das transações

Escalabilidade

Boa arquitetura de software

Não criar funcionalidades falsas ou interfaces que aparentem estar conectadas quando não estiverem. Todas as integrações devem utilizar as APIs/SDKs reais correspondentes.

Esse é o prompt final consolidado. O App ID que colocaste já está incluído na configuração da Privy; não incluí nenhuma chave secreta.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/48280f30-514f-43a1-a145-176e647ac0fb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
