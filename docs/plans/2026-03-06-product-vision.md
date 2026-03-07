# Product Vision – LifeOS

**Data:** 2026-03-06
**Status:** Análise estratégica — uso pessoal + potencial comercial futuro

---

## O que é o LifeOS

Um sistema pessoal de organização de vida, focado em:
- Tarefas com mínima fricção de criação
- Objetivos com progresso visível
- Agenda integrada (tasks + eventos externos)
- Compartilhamento com pessoas próximas (namorada, família)

**Não é:** ferramenta de gestão de projetos de equipe (Jira, Linear, Notion). O foco é vida pessoal, não produtividade corporativa.

**Compete com:** Todoist, Things 3, TickTick, Any.do — não com Notion ou Jira.

**Diferencial único:** integração de tasks + goals + agenda compartilhada para casais/família.

---

## Estado atual do projeto

O projeto está em ~30% do MVP funcional. A base técnica é sólida:
- Clean Architecture + monorepo + TypeScript end-to-end
- Lambda + DynamoDB (custo quase zero para uso pessoal)
- Contratos compartilhados entre SPA e API

O que está **incompleto:**
- CRUD completo de Tasks (falta update, delete, mark complete)
- Backend de Projects modo Goal (só campos de domínio, sem endpoints)
- Autenticação real (Google OAuth está mockada)
- DynamoDB implementado (só in-memory)
- Views "Hoje" e "Próximos dias" conectadas ao backend (são mocks)
- Dashboard com dados reais (100% hardcoded)

---

## Roadmap por fases

### Fase 1 – MVP Funcional (prioridade agora)

**Objetivo:** ter algo que você realmente usa no dia a dia.

1. Autenticação real (Google OAuth)
2. DynamoDB implementado de verdade
3. CRUD completo de Tasks
4. Projects com campos de Goal (targetValue, deadline, status)
5. Views "Hoje" e "Próximos dias" conectadas ao backend
6. Dashboard com dados reais
7. Deploy em produção

Não avançar para Fase 2 sem a Fase 1 estar completa e em uso real.

### Fase 2 – Agenda

#### 2a. Calendar view interno
Exibir tasks com `dueDate` em uma view de calendário mensal/semanal.
O componente `react-day-picker` já existe no projeto.

- **Complexidade:** baixa
- **Esforço:** 1–2 semanas

#### 2b. Google Calendar (read-only primeiro)
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

Two-way sync (criar/editar eventos no Google pelo app) fica para v3:
- Muito mais complexo (conflitos, deduplicação, webhooks)
- Risco real de bugs que apagam eventos do usuário
- Não é necessário para o caso de uso principal

- **Complexidade:** média
- **Esforço:** 2–4 semanas

### Fase 3 – Compartilhamento

#### 3a. Link de visualização (MVP de compartilhamento)

A forma mais simples de "minha namorada ver minha agenda":

```
1. Usuário gera link único com token (ex: lifeos.app/shared/abc123)
2. Link expira em X dias ou é permanente (usuário escolhe)
3. Quem abre o link vê a agenda em modo leitura, sem precisar criar conta
4. Usuário pode revogar o link a qualquer momento
```

Schema necessário:
```typescript
ShareLink {
  token: string       // unique, random
  userId: string      // owner
  scope: 'agenda' | 'project' | 'all'
  resourceId?: string // se scope = 'project'
  expiresAt?: Date
  createdAt: Date
}
```

- **Complexidade:** baixa
- **Esforço:** 1–2 dias

#### 3b. Conta compartilhada (v2 de compartilhamento)

Namorada cria conta, você dá acesso à sua agenda. Ela vê na sidebar dela como "Agenda do Vitor". Podem criar tasks compartilhadas.

- **Complexidade:** alta (permissões, queries multi-usuário, UI de diferenciação)
- **Esforço:** 2–4 semanas
- **Recomendação:** só após 3a estar em uso real

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
- Compartilhamento de agenda para casais é um problema real pouco resolvido (Cozi e TimeTree existem mas são genéricos)
- A combinação tasks + goals + agenda compartilhada em uma única ferramenta não tem um player dominante claro

### Modelos possíveis

**Freemium (recomendado se monetizar)**
- Grátis: tasks, inbox, projetos básicos, até 2 projetos ativos
- Pago (~R$ 20–35/mês): goals com progresso, agenda, Google Calendar sync, compartilhamento

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
| Google Calendar two-way sync bugado | Começar com read-only, two-way fica em v3 |
| Motivação cair se não usar no dia a dia | Deploy em produção o quanto antes — uso real mantém motivação |
| Lock-in AWS | Arquitetura já é database-agnostic por design (protocols/interfaces) |
| Mercado saturado se monetizar | Nicho específico (casais) + não depender de monetização para continuar |

---

## Decisão final: vale a pena continuar?

**Sim.** A base técnica é rara para um projeto pessoal. O custo de operar é quase zero. Cada fase adiciona habilidades reais (OAuth, Calendar API, compartilhamento, real-time). E você é o usuário — o melhor filtro de priorização que existe.

O próximo passo crítico é **terminar a Fase 1** antes de qualquer nova feature.
