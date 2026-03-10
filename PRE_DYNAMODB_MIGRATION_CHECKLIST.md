# Pre-DynamoDB Migration Checklist

> **⚠️ IMPORTANTE:** Este documento lista todas as tarefas e decisões necessárias antes de migrar do repositório mock em memória para o DynamoDB real.

---

## 📊 Table of Contents

- [Database Design Decisions](#database-design-decisions)
- [API Optimizations](#api-optimizations)
- [Frontend Optimizations](#frontend-optimizations)
- [Performance & Scalability](#performance--scalability)
- [Testing & Validation](#testing--validation)
- [Infrastructure & DevOps](#infrastructure--devops)

---

## 🗄️ Database Design Decisions

### ⚠️ **1. Analisar e remover GSI6 para Projetos**

**Status:** 🔴 Pendente

**Contexto:**
- Atualmente, a tabela de projetos usa GSI6 para ordenação alfabética por nome
- GSI6PK: `USER#userId`
- GSI6SK: `PROJECT#name#projectId`

**Análise:**
- **Expectativa:** Usuários terão **menos de 10 projetos** na média
- **Uso típico:** 5-7 projetos ativos
- **Sidebar:** Mostra apenas os primeiros 5 projetos
- **Performance:** Ordenar 10 itens no JavaScript é **< 1ms** (insignificante)

**Motivos para REMOVER GSI6:**
1. ✅ **Over-engineering** - Complexidade desnecessária para poucos itens
2. ✅ **Custo** - Economiza WCU (Write Capacity Units) e storage
3. ✅ **Simplicidade** - Menos índices = menos pontos de falha
4. ✅ **Rápido o suficiente** - Ordenação client-side é instantânea com < 50 itens
5. ✅ **YAGNI** - You Aren't Gonna Need It (por enquanto)

**Alternativa proposta:**
```typescript
// Query na tabela principal
PK = USER#userId AND SK begins_with PROJECT#

// Ordenar no código (backend ou frontend)
projects.sort((a, b) => a.name.localeCompare(b.name));
```

**Ações necessárias:**
- [ ] Remover `GSI6PK` e `GSI6SK` de `ProjectDynamoDBEntity` (types.ts)
- [ ] Atualizar `ProjectDynamoMapper.toDatabase()` para não gerar GSI6
- [ ] Atualizar mocks para remover campos GSI6
- [ ] Adicionar ordenação no repositório ou service
- [ ] Atualizar documentação do database design
- [ ] Decidir: ordenar no backend (repository) ou frontend (componente)?

**Decisão final:** ⏳ A ser decidida

---

### 2. **Avaliar outros índices (GSI1-GSI5)**

**Status:** 🟡 Revisar

- [ ] Revisar se TODOs precisam de todos os GSIs definidos
- [ ] Documentar casos de uso reais para cada GSI
- [ ] Remover GSIs desnecessários antes de criar a tabela real

---

## 🔧 API Optimizations

### ⚠️ **3. Implementar paginação na listagem de projetos**

**Status:** 🔴 Pendente

**Contexto:**
- Atualmente, `getAllProjectsByUser()` retorna **TODOS** os projetos
- Sidebar mostra apenas **5 projetos**
- Desperdiça banda e processamento trazendo todos quando só precisa de 5

**Proposta:**
```typescript
interface GetProjectsParams {
  userId: string;
  limit?: number;        // Default: 5 (sidebar) ou 20 (página)
  lastEvaluatedKey?: string;  // Para paginação
}

interface GetProjectsResponse {
  projects: Project[];
  nextToken?: string;    // Para carregar mais
  total?: number;        // Total de projetos do usuário
}
```

**Ações necessárias:**
- [ ] Adicionar parâmetro `limit` em `ProjectRepository.getAllProjectsByUser()`
- [ ] Implementar lógica de paginação no repositório
- [ ] Atualizar service para passar `limit`
- [ ] Atualizar controller para aceitar query params `?limit=5`
- [ ] Criar endpoint separado para "All Projects" se necessário

**Endpoints sugeridos:**
```
GET /api/projects?limit=5           # Para sidebar
GET /api/projects?limit=20          # Para página "All Projects"
GET /api/projects/all               # Retorna todos (sem limite)
```

---

### 4. **Implementar soft delete completo**

**Status:** 🟡 Pendente

- [ ] Implementar método `softDelete(projectId)` no repositório
- [ ] Adicionar filtro `deleted_at = null` em todas as queries
- [ ] Criar endpoint para listar projetos arquivados
- [ ] Implementar restauração de projetos deletados

---

### 5. **Adicionar timestamps automáticos**

**Status:** 🟡 Pendente

- [ ] Garantir que `createdAt` só é setado no `create()`
- [ ] Garantir que `updatedAt` é atualizado em todo `update()`
- [ ] Adicionar middleware ou helper para timestamps

---

### 10. **Implementar rate limiting**

**Status:** 🔴 Pendente

- [ ] Limitar criação de projetos (ex: máx 100 por usuário)
- [ ] Rate limit na API (ex: 100 requests/min por usuário)
- [ ] Adicionar validação de limites no backend

---

### 11. **Preparar para escala**

**Status:** 🟡 Revisar

**Métricas a definir:**
- Quantos projetos por usuário? (expectativa: < 50)
- Quantos usuários simultâneos? (expectativa: ?)
- Frequência de criação/atualização? (expectativa: ?)

**Ações:**
- [ ] Definir WCU/RCU necessários para DynamoDB
- [ ] Configurar auto-scaling
- [ ] Definir alarmes no CloudWatch

---

## 🧪 Testing & Validation

### 12. **Testes antes da migração**

**Status:** 🔴 Pendente

- [ ] **Unit tests** para repositories
- [ ] **Integration tests** para services
- [ ] **E2E tests** para fluxo completo de projetos
- [ ] Testar soft delete
- [ ] Testar ordenação
- [ ] Testar paginação
- [ ] Testar casos extremos:
  - [ ] Usuário sem projetos
  - [ ] Usuário com 100+ projetos
  - [ ] Nomes de projetos com caracteres especiais
  - [ ] Projetos com mesmo nome

---

### 13. **Validação de dados**

**Status:** 🟡 Pendente

- [ ] Validar tamanho máximo do nome (limite do DynamoDB)
- [ ] Validar tamanho máximo da descrição
- [ ] Validar caracteres especiais
- [ ] Adicionar validação no backend (DTO)
- [ ] Adicionar validação no frontend (schema)

---

## 🏗️ Infrastructure & DevOps

### 14. **Configurar DynamoDB**

**Status:** 🔴 Pendente

- [ ] Criar tabela no AWS Console ou via IaC (CloudFormation/Terraform)
- [ ] Definir nome da tabela (ex: `artemis-prod`)
- [ ] Configurar billing mode (On-Demand vs Provisioned)
- [ ] Configurar Point-in-Time Recovery (PITR)
- [ ] Configurar backups automáticos
- [ ] Configurar TTL (Time To Live) se necessário

---

### 15. **Configurar ambientes**

**Status:** 🔴 Pendente

- [ ] **Development:** Usar mocks em memória (atual)
- [ ] **Staging:** Usar DynamoDB real com dados de teste
- [ ] **Production:** Usar DynamoDB real com dados reais

**Variáveis de ambiente necessárias:**
```env
DYNAMODB_TABLE_NAME=artemis-prod
DYNAMODB_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
USE_MOCK_REPOSITORIES=false  # true em dev, false em staging/prod
```

---

### 16. **Implementar migrations/seed**

**Status:** 🔴 Pendente

- [ ] Script para criar tabela
- [ ] Script para popular dados iniciais (seed)
- [ ] Script para migração de dados (se houver dados existentes)
- [ ] Validar integridade dos dados após migração

---

### 17. **Monitoramento e observabilidade**

**Status:** 🔴 Pendente

- [ ] Configurar CloudWatch Logs
- [ ] Configurar alarmes (throttling, erros, latência)
- [ ] Adicionar logs estruturados (usando logger do projeto)
- [ ] Configurar tracing (X-Ray ou similar)
- [ ] Dashboard com métricas principais

---

## 📋 Checklist Final

Antes de migrar para DynamoDB, verificar:

- [ ] **Todas as decisões de design tomadas** (GSIs, índices, keys)
- [ ] **API implementa paginação** (pelo menos para projetos)
- [ ] **Frontend otimizado** (sidebar mostra apenas 5 projetos)
- [ ] **Testes implementados** (unit, integration, e2e)
- [ ] **Infraestrutura configurada** (DynamoDB, IAM, backups)
- [ ] **Monitoramento ativo** (logs, alarmes, métricas)
- [ ] **Documentação atualizada** (README, database design, API docs)
- [ ] **Plano de rollback** (como voltar para mocks se der problema)

---

## 🚨 Riscos e Mitigações

### Risco 1: Performance ruim com muitos projetos
**Mitigação:** Implementar paginação e lazy loading

### Risco 2: Custos inesperados
**Mitigação:** Começar com On-Demand, monitorar custos, configurar alarmes

### Risco 3: Perda de dados
**Mitigação:** Habilitar PITR, fazer backups regulares, testar restore

### Risco 4: Throttling do DynamoDB
**Mitigação:** Configurar auto-scaling, implementar retry com backoff

---

## 📚 Referências

- [Database Design Documentation](./docs/database-design.md)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [Single Table Design](https://www.alexdebrie.com/posts/dynamodb-single-table/)

---

**Última atualização:** Janeiro 2026
**Responsável:** Time de Desenvolvimento
**Status geral:** 🔴 Em preparação
