# Cursor Rules — SPA (React)

Rules específicas do app React/SPA. São carregadas quando você trabalha no SPA (por exemplo, abrindo a pasta `apps/spa` como workspace ou quando os globs batem com arquivos do SPA).

| Rule | Escopo | Descrição |
|------|--------|-----------|
| **import-standards.mdc** | `apps/spa/**/*.{ts,tsx}` | Aliases `@/` e `@repo/*`, evitar paths relativos |
| **react-patterns.mdc** | `apps/spa/**/*.{tsx,jsx}` | Componentes funcionais, RenderIf, props/params, hooks |
| **react-query-patterns.mdc** | `apps/spa/**/*{hook,service}*.ts` | Cache, query keys, mutations, invalidação |
| **ui-reuse-components.mdc** | `apps/spa/src/**/*.{tsx,jsx}` | Reuso de Card, Button e componentes `@repo/ui` |
| **spa-services-contracts.mdc** | `apps/spa/**/modules/**/app/services/*.ts` | Tipagem via `@repo/contracts` em services |

Rules globais do monorepo (project-standards, clean-architecture, domain, etc.) ficam em `.cursor/rules` na raiz do repositório.
