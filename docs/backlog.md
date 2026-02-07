# Backlog — Melhorias e itens importantes

Este documento concentra **itens importantes** que precisam ser feitos em algum momento. Serve como referência para evolução da arquitetura e da qualidade do projeto.

---

## Por que isso importa: System Boundaries

Respeitar **fronteiras do sistema** (system boundaries) traz:

- **Encapsulamento**: cada módulo/sistema expõe apenas o necessário; o resto fica interno.
- **Evolução independente**: mudanças em um lugar não quebram outros se os contratos na fronteira forem estáveis.
- **Responsabilidade clara**: fica explícito quem depende de quem e por qual interface.

Os itens abaixo têm impacto direto em como desenhamos e respeitamos essas fronteiras no Artemis.

---

## Itens do backlog

### 1. Criar o pacote de contracts

**O quê:** Implementar o pacote `@repo/contracts` no monorepo, conforme descrito em [contracts-package.md](./contracts-package.md).

**Por quê:** Hoje os tipos de request/response entre SPA e API podem divergir. Um único pacote de contratos (tipos e, opcionalmente, rotas) define a **fronteira explícita** entre frontend e backend: type-safety, documentação viva e desacoplamento controlado.

**Referência:** [docs/contracts-package.md](./contracts-package.md)

---

### 2. Resolver importações entre módulos (cross-module imports)

**O quê:** Reduzir ou eliminar o cenário em que um módulo (`todo`, `projects`, `sections`) importa **diretamente** de outro módulo (entities, hooks, componentes).

**Situação atual:** Existe um “triângulo” de dependências: `todo` → `projects` e `sections`; `projects` → `sections` e `todo`; `sections` → `projects` e `todo`. Em especial:

- Entidades de um módulo importam tipos de outro (ex.: `project-detail.ts` importa de sections e todo; `section-with-todos.ts` importa de todo).
- Hooks/forms de um módulo usam hooks de outro (ex.: `todo-form.hook.ts` usa hooks de projects e sections).
- Componentes de um módulo usam modais/componentes de outro (ex.: `project-section.tsx` usa modais do todo).

**Por quê (system boundaries):** Quando módulos importam o “interior” de outros módulos, a fronteira de cada módulo deixa de existir na prática. Fica difícil evoluir um módulo sem afetar os outros, e o acoplamento cresce. O ideal é que a **composição** (páginas e layouts) importe de vários módulos, mas que **cada módulo não dependa de outro** — ou que dependa apenas de uma camada compartilhada (ex.: contracts ou tipos comuns).

**Possíveis direções:**

- Extrair tipos compartilhados (ex.: `Todo`, `SectionWithTodos`) para um pacote comum ou para o pacote de contracts, e cada módulo importar de lá na borda.
- Orquestrar uso de projetos/seções/todos apenas na camada de **view** (páginas, layouts), passando dados por props; formulários recebem listas já carregadas em vez de chamar hooks de outros módulos.
- Definir uma “API pública” por módulo (um único ponto de export) e fazer com que outros módulos (ou a view) dependam só dessa API, não de arquivos internos.

**Referência:** Ver análise de imports entre módulos (grep por `@/modules/` em `apps/spa/src`) e a discussão sobre system boundaries.

---

## Como usar este backlog

- **Adicionar itens:** use o mesmo formato (título, “O quê”, “Por quê”, referências).
- **Priorizar:** pode-se adicionar labels (ex.: P1, P2) ou uma seção “Próximos passos” no topo.
- **Concluir:** ao resolver um item, pode movê-lo para uma seção “Concluído” com data e link para PR/doc.
