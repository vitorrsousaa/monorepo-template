# app

Documento compartilhado que explica **toda** a estrutura dentro de `app/`: config, contexts, errors, hooks, libs, services, storage e utils num só lugar.

## O que é

Camada **transversal** da aplicação — configuração, infraestrutura, serviços globais e utilitários (não específicos de um módulo). Os módulos em `src/modules/*` usam os serviços e a config daqui (por exemplo `httpClient` e `query-keys`).

## Estrutura

```
app/
├── config/      # Configuração estática
├── contexts/    # React Contexts globais
├── errors/      # Tipos e helpers de erro
├── hooks/       # Hooks partilhados entre módulos
├── libs/        # Wrappers de bibliotecas externas
├── services/    # Serviços de infraestrutura partilhados
├── storage/    # Abstração de persistência local
└── utils/      # Funções utilitárias puras
```

### config/

Configuração estática da aplicação.

| Ficheiro | Propósito |
|----------|-----------|
| **routes.ts** | Constantes de caminhos de rotas. |
| **query-keys.ts** | Chaves do TanStack Query (usadas pelos hooks dos módulos). |
| **storage.ts** | Constantes de chaves de storage (`STORAGE_KEYS`). |
| **constants.ts** | Constantes globais da app. |
| **environment.ts** | Acesso a variáveis de ambiente (ex.: `VITE_API_BASE_URL`). |

### contexts/

React Contexts globais. Fornecem estado e API (ex.: autenticação) à árvore de componentes.

| Exemplo | Uso |
|---------|-----|
| **auth.tsx** | Estado e funções de autenticação (login, logout, user). |

### errors/

Tipos e helpers de erro da aplicação.

| Exemplo | Uso |
|---------|-----|
| **app-error.ts** | Tipo/helper para erros da app. |

### hooks/

Hooks **partilhados** entre módulos. Diferem dos hooks por feature em `modules/<feature>/app/hooks`.

| Exemplo | Uso |
|---------|-----|
| **auth.ts** | Hooks de autenticação (uso do contexto auth). |

### libs/

Wrappers e configuração única de bibliotecas externas.

| Exemplo | Uso |
|---------|-----|
| **query.tsx** | Configuração do TanStack QueryClient (staleTime, gcTime, retry, etc.). |

### services/

Serviços de infraestrutura partilhados. Os módulos usam estes clientes nos seus próprios services.

| Exemplo | Uso |
|---------|-----|
| **http-client.ts** | Cliente HTTP (axios, baseURL, header de auth). Usado por todos os services dos módulos. |

### storage/

Abstração de persistência local (localStorage, etc.). Usada por auth e config.

| Exemplo | Uso |
|---------|-----|
| **token-storage.ts** | Leitura/escrita do token de acesso. |

### utils/

Funções utilitárias puras (sem side effects de rede ou storage).

| Exemplo | Uso |
|---------|-----|
| **date-utils.ts** | Formatação e manipulação de datas. |
| **truncate-text.ts** | Truncar texto para UI. |
| **delay.ts** | Atraso artificial (ex.: dev). |
| **types.ts** | Tipos utilitários partilhados. |

## Referências

- Config crítica (TanStack Query, HTTP): [../CLAUDE.md](../CLAUDE.md).
- Convenções de código: [../../.cursor/rules/project-standards.mdc](../../.cursor/rules/project-standards.mdc).
