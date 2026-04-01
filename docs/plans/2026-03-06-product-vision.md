# Product Vision – LifeOS

**Data:** 2026-03-06 (atualizado em 2026-03-31)
**Status:** Análise estratégica — uso pessoal + potencial comercial futuro

---

## O que é o LifeOS

Um sistema pessoal de organização de vida, focado em:
- Tarefas com mínima fricção de criação
- Compartilhamento de tasks entre casais/família
- Finanças compartilhadas (controle de gastos e orçamento em casal)
- Agenda integrada (tasks + eventos externos)

**Não é:** ferramenta de gestão de projetos de equipe (Jira, Linear, Notion). O foco é vida pessoal, não produtividade corporativa.

**Compete com:** Todoist, Things 3, TickTick, Any.do (tasks) + Splitwise, Mobills (finanças) — não com Notion ou Jira.

**Diferencial único:** integração de tasks + finanças + agenda compartilhada para casais/família em uma única plataforma.

> **Decisão (2026-03-31):** Goals/Objetivos removidos do escopo por enquanto. O foco passa a ser compartilhamento de tasks e módulo de finanças.

---

## Estado atual do projeto

O projeto está em ~30% do MVP funcional. A base técnica é sólida:
- Clean Architecture + monorepo + TypeScript end-to-end
- Lambda + DynamoDB (custo quase zero para uso pessoal)
- Contratos compartilhados entre SPA e API

O que está **incompleto:**
- CRUD completo de Tasks (falta update, delete, mark complete)
- ~~Backend de Projects modo Goal (só campos de domínio, sem endpoints)~~ → **removido do escopo**
- Autenticação real (Google OAuth está mockada)
- DynamoDB implementado (só in-memory)
- Views "Hoje" e "Próximos dias" conectadas ao backend (são mocks)
- Dashboard com dados reais (100% hardcoded)
- Compartilhamento de tasks entre usuários (novo)
- Módulo de finanças compartilhadas (novo)

---

## Roadmap por fases

### Fase 1 – MVP Funcional (prioridade agora)

**Objetivo:** ter algo que você realmente usa no dia a dia.

1. Autenticação real (Google OAuth)
2. DynamoDB implementado de verdade
3. CRUD completo de Tasks
4. Views "Hoje" e "Próximos dias" conectadas ao backend
5. Dashboard com dados reais
6. Deploy em produção

Não avançar para Fase 2 sem a Fase 1 estar completa e em uso real.

### Fase 2 – Compartilhamento de Tasks

**Objetivo:** permitir que um casal compartilhe tasks entre si.

#### 2a. Conta compartilhada (core do compartilhamento)

Ambos criam conta. Um convida o outro como "parceiro(a)". Tasks podem ser:
- **Pessoais** — visíveis só para o dono
- **Compartilhadas** — visíveis para ambos, ambos podem editar/completar

```
Fluxo:
1. Usuário envia convite (email ou link)
2. Parceiro(a) aceita e as contas ficam vinculadas
3. Tasks marcadas como "compartilhada" aparecem para ambos
4. Projetos inteiros podem ser compartilhados
5. Cada um mantém sua inbox pessoal + vê tasks compartilhadas
```

- **Complexidade:** média-alta (permissões, queries multi-usuário, UI de diferenciação)
- **Esforço:** 3–4 semanas

#### 2b. Notificações básicas

Quando o parceiro(a) completa ou cria uma task compartilhada, o outro recebe notificação (in-app primeiro, push depois).

- **Complexidade:** média
- **Esforço:** 1–2 semanas

### Fase 3 – Finanças Compartilhadas

**Objetivo:** controle financeiro simples para casais, integrado ao mesmo app.

#### 3a. Registro de gastos

Registrar despesas com categoria, valor, data e quem pagou. Visão consolidada do casal.

```
Entidades principais:
- Expense { amount, category, date, paidBy, shared, description }
- Category { name, icon, color, budget? }
- Budget { category, monthlyLimit, period }
```

- **Complexidade:** média
- **Esforço:** 2–3 semanas

#### 3b. Dashboard financeiro

Visão mensal de gastos por categoria, comparação com meses anteriores, divisão entre o casal.

- **Complexidade:** média
- **Esforço:** 1–2 semanas

#### 3c. Orçamento e metas financeiras (v2)

Definir limites por categoria, alertas quando perto do limite.

- **Complexidade:** baixa-média
- **Esforço:** 1–2 semanas

### Fase 4 – Agenda

#### 4a. Calendar view interno
Exibir tasks com `dueDate` em uma view de calendário mensal/semanal.
O componente `react-day-picker` já existe no projeto.

- **Complexidade:** baixa
- **Esforço:** 1–2 semanas

#### 4b. Google Calendar (read-only primeiro)
Mostrar eventos do Google Calendar na mesma view das tasks.

```
Fluxo:
1. Usuário conecta Google Calendar (OAuth, scope: calendar.readonly)
2. Backend armazena refresh_token
3. Backend busca eventos via Google Calendar API
4. SPA exibe tasks + eventos na mesma agenda

Limitações intencionais do MVP:
- Só leitura (não cria eventos no Google)
- Só calendários do próprio usuário
- Sem sync em tempo real (pull periódico ou on-demand)
```

Two-way sync (criar/editar eventos no Google pelo app) fica para v5+:
- Muito mais complexo (conflitos, deduplicação, webhooks)
- Risco real de bugs que apagam eventos do usuário
- Não é necessário para o caso de uso principal

- **Complexidade:** média
- **Esforço:** 2–4 semanas

---

## Custos de hospedagem

### Uso pessoal (1–5 usuários)

| Serviço | Custo/mês |
|---|---|
| AWS Lambda | Grátis (free tier: 1M requests/mês) |
| DynamoDB | Grátis (free tier: 25 GB, 25 WCU/RCU) |
| API Gateway | Grátis (free tier: 1M calls/mês) |
| S3 + CloudFront | ~$0,50–$2 |
| Route53 + domínio | ~$1–2 |
| **Total** | **~$2–5/mês** |

Para uso pessoal, a stack atual é essencialmente gratuita.

### Se virar SaaS (100 usuários)

| Serviço | Custo/mês |
|---|---|
| AWS Lambda | ~$5–15 |
| DynamoDB | ~$15–40 |
| API Gateway | ~$3–10 |
| S3 + CloudFront | ~$5–15 |
| Cognito | ~$0–5 |
| Route53 | ~$2 |
| **Total** | **~$30–90/mês** |

**Alternativa mais simples para SaaS pequeno:**
Railway ou Render (Node + Postgres): ~$10–25/mês tudo incluído. Menos overhead de configuração que Lambda + DynamoDB.

---

## Potencial de monetização

**Posicionamento:** Todoist-like para vida pessoal, com foco em agenda compartilhada para casais/família.

### Por que esse nicho pode funcionar

- O mercado de productivity tools pessoais tem usuários dispostos a pagar ($4–15/mês é comum)
- Compartilhamento de tasks + finanças para casais é um problema real pouco resolvido
- A combinação tasks + finanças compartilhadas + agenda em uma única ferramenta não tem um player dominante claro
- Apps de finanças para casais (Splitwise, Mobills) não integram com produtividade pessoal

### Modelos possíveis

**Freemium (recomendado se monetizar)**
- Grátis: tasks, inbox, projetos básicos, até 2 projetos ativos
- Pago (~R$ 20–35/mês): finanças compartilhadas, agenda, Google Calendar sync, compartilhamento ilimitado

**Lifetime (alternativo)**
- Cobrança única (R$ 150–300) para acesso vitalício
- Funciona bem para audiences de desenvolvedores/early adopters

**Open Source + SaaS**
- Código aberto (GitHub)
- Self-hosted gratuito
- Cloud gerenciado pago (você mantém a infra)
- Constrói audiência e reputação técnica

### Expectativa realista

Não construa esperando monetizar. O mercado de productivity tools tem um cemitério enorme de ferramentas bem feitas que não ganharam tração. Construa porque você usa, porque aprende, e porque a stack é um ativo técnico demonstrável.

Se em 6–12 meses você usar todo dia e outras pessoas pedirem acesso, aí vale explorar monetização com dados reais de uso.

---

## Riscos principais

| Risco | Mitigação |
|---|---|
| Scope creep (adicionar features antes de terminar o MVP) | Priorizar Fase 1 rigidamente |
| Google Calendar two-way sync bugado | Começar com read-only, two-way fica para depois |
| Motivação cair se não usar no dia a dia | Deploy em produção o quanto antes — uso real mantém motivação |
| Lock-in AWS | Arquitetura já é database-agnostic por design (protocols/interfaces) |
| Mercado saturado se monetizar | Nicho específico (casais) + não depender de monetização para continuar |
| Complexidade do compartilhamento multi-usuário | Começar com modelo simples (casal = 2 contas vinculadas), evitar permissões granulares |
| Módulo de finanças distrair do core de tasks | Só iniciar Fase 3 após compartilhamento de tasks funcionar |

---

## Decisão final: vale a pena continuar?

**Sim.** A base técnica é rara para um projeto pessoal. O custo de operar é quase zero. Cada fase adiciona habilidades reais (OAuth, Calendar API, compartilhamento, real-time). E você é o usuário — o melhor filtro de priorização que existe.

O próximo passo crítico é **terminar a Fase 1** antes de qualquer nova feature. Em seguida, compartilhamento de tasks (Fase 2) e finanças (Fase 3) — nessa ordem.
