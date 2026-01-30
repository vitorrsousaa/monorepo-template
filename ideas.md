LifeOS – MVP (Tasks + Metas)

Visão do Produto

Um auxiliar de vida focado em tarefas acionáveis, metas mensuráveis e organização flexível. Não é apenas um todo list: é um sistema que conecta ação diária com objetivos de longo prazo, sem forçar o usuário a classificar tudo.

Princípios:
• ✨ Fricção mínima para criar tasks
• 🧠 Estrutura opcional (grupo/meta são auxiliares, não obrigatórios)
• 📈 Progresso visível e motivador
• 🧩 Evolutivo (calendário, hábitos, eventos no futuro)

⸻

Entidades do Domínio (MVP)

1. Task

A unidade central do sistema.

Regras-chave:
• Pode existir sem grupo
• Pode existir sem meta
• Pode existir sem data

Task {
id: string
title: string
description?: string

completedAt?: Date
dueDate?: Date

groupId?: string
goalId?: string

value?: number // ex: dinheiro, horas
createdAt: Date
}

Exemplos válidos:
• “Comprar remédio pro cachorro” (task solta)
• “Guardar R$ 2.000” (task vinculada à meta)
• “Limpar garagem” (task com grupo Casa)

⸻

2. Group (Contexto / Área da Vida)

Serve apenas para organizar.

Group {
id: string
name: string
color?: string
icon?: string
}

Exemplos:
• Casa
• Finanças
• Trabalho
• Saúde

Um group não tem progresso, prazo ou meta.

⸻

3. Goal (Meta)

Direção e intenção.

Goal {
id: string
title: string
description?: string

targetValue?: number
deadline?: Date

createdAt: Date
}

Tipos implícitos:
• Quantitativa → usa targetValue
• Qualitativa → progresso por tasks concluídas

⸻

Relacionamentos
• Task → Group (opcional)
• Task → Goal (opcional)
• Goal → N Tasks
• Group → N Tasks

A task é sempre válida sozinha.

⸻

MVP – Funcionalidades Essenciais

Tasks
• Criar task em 1 input rápido
• Marcar como concluída
• Editar título, data, grupo, meta
• Tasks sem grupo vão para “Inbox”

Groups
• Criar / editar / remover
• Usado apenas como filtro visual

Goals
• Criar meta
• Vincular tasks
• Ver progresso automático

⸻

Sidebar (Estrutura Recomendada)

📥 Inbox
📅 Hoje
🗓️ Próximos dias

———
🎯 Metas
• Juntar 20k
• Ficar saudável

———
📁 Grupos
• Casa
• Finanças
• Trabalho

———
📊 Dashboards
• Visão geral
• Metas

Inbox
• Todas as tasks sem grupo e sem data
• Caixa de entrada mental

⸻

Views Principais

1. Inbox
   • Lista simples
   • Zero julgamento
   • Ideal para captura rápida

2. Hoje
   • Tasks com dueDate = hoje
   • Tasks atrasadas aparecem no topo

3. Próximos dias
   • Visão tipo agenda (lista, não calendário ainda)

⸻

Dashboard de Tasks

Cards sugeridos:
• 📌 Tasks em aberto
• ⏰ Tasks atrasadas
• ✅ Tasks concluídas na semana
• 📥 Tasks sem grupo

Objetivo: consciência, não cobrança.

⸻

Dashboard de Metas

Para cada meta:
• Título
• Barra de progresso
• Valor atual / alvo (se aplicável)
• Tasks concluídas / total
• Dias restantes

Exemplo visual:

Juntar R$ 20.000
██████████░░░░░░░ 60%
R$ 12.000 / R$ 20.000

⸻

Tasks + Calendário (Decisão de MVP)

Regra importante

Task ≠ Evento

Task
• Algo a ser feito
• Pode atrasar
• Pode não ter horário

Evento (futuro)
• Algo que acontece em um horário fixo
• Não atrasa

⸻

MVP – Abordagem Recomendada

✅ Tasks com dueDate
• Exibidas em listas temporais
• NÃO bloquear em horários

🚫 Sem calendário visual completo no MVP

Motivo:
• Calendário adiciona complexidade alta
• Mistura conceitos cedo demais

⸻

Evolução Planejada (v2 / v3)

v2
• Visual semanal (kanban por dia)
• Reordenação por prioridade

v3
• Entidade Event
• Integração com Google Calendar
• Sync parcial (eventos ≠ tasks)

⸻

Fluxo do Usuário (MVP) 1. Usuário abre o app 2. Digita uma task rápida (Inbox) 3. Depois decide:
• Adicionar data
• Vincular a meta
• Mover para grupo 4. Executa no dia a dia 5. Acompanha metas no dashboard

⸻

Por que esse MVP é forte como projeto pessoal
• Modelagem de domínio realista
• Separação clara de conceitos
• UX focada em vida real
• Base sólida para crescer

Esse não é um “todo list” — é um sistema de ação pessoal.

⸻

Próximos Passos Possíveis 1. Definir stack (Next, mobile, local-first?) 2. Criar wireframe de 3 telas-chave 3. Definir regras de progresso das metas 4. Pensar em identidade visual minimalista

Se quiser, no próximo passo posso:
• Criar wireframes textuais das telas
• Ajudar a escolher stack ideal
• Refinar regras de progresso
