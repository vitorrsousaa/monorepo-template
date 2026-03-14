# Proposta de Arquitetura - API Artemis

## 📋 Análise da Arquitetura do Grypp

### ✅ Pontos Fortes Identificados

#### 1. **Separação de Responsabilidades Clara**
- **Camadas bem definidas**: Controller → Service → Repository
- **Domain Models isolados**: Entidades de domínio em `core/domain`
- **Interfaces bem definidas**: Contratos claros entre camadas

#### 2. **Factory Pattern para Dependency Injection**
- **Factories centralizadas**: Todas as dependências criadas em `factories/`
- **Inversão de dependência**: Facilita testes e manutenção
- **Composição clara**: Fácil de entender o fluxo de criação

#### 3. **Estrutura Modular**
- **Módulos por domínio**: Cada feature tem seu próprio módulo
- **Organização consistente**: `controllers/`, `services/`, `errors/` dentro de cada módulo
- **Reutilização**: Providers e repositories compartilhados

#### 4. **Validação com Zod**
- **Schemas tipados**: Validação e tipagem em um só lugar
- **Função `missingFields`**: Abstração útil para validação
- **Type safety**: TypeScript + Zod = segurança de tipos

#### 5. **Error Handling Centralizado**
- **Classes de erro customizadas**: `AppError`, `ServerError`, `ZodError`
- **Error handler único**: Tratamento consistente em toda aplicação
- **Mensagens padronizadas**: Facilita debugging

#### 6. **Infraestrutura AWS Serverless**
- **Serverless Framework**: Configuração declarativa
- **DynamoDB Single-Table Design**: Eficiente e escalável
- **Cognito Integration**: Autenticação gerenciada
- **Lambda Functions**: Escalabilidade automática

### ⚠️ Pontos de Melhoria Identificados

#### 1. **Falta de Middleware System**
- **Problema**: Não há sistema de middlewares para cross-cutting concerns
- **Impacto**: Lógica repetida (ex: logging, rate limiting, validação de permissões)
- **Solução**: Implementar sistema de middlewares antes dos controllers

#### 2. **Validação Apenas no Controller**
- **Problema**: Validação só acontece no controller, não no service
- **Impacto**: Services podem receber dados inválidos se chamados diretamente
- **Solução**: Validação também no service ou usar DTOs tipados

#### 3. **Falta de Logging Estruturado**
- **Problema**: Apenas `console.log` para erros
- **Impacto**: Dificulta debugging em produção
- **Solução**: Implementar logger estruturado (já existe `@shared/logger`)

#### 4. **Repositories com Lógica de Negócio**
- **Problema**: Alguns repositories fazem transformações complexas
- **Impacto**: Mistura de responsabilidades
- **Solução**: Repositories apenas para acesso a dados, mappers separados

#### 5. **Falta de Testes de Integração**
- **Problema**: Apenas testes unitários
- **Impacto**: Não garante que o sistema funciona end-to-end
- **Solução**: Adicionar testes de integração com DynamoDB local

#### 6. **Documentação OpenAPI Incompleta**
- **Problema**: Documentação pode estar desatualizada
- **Impacto**: Dificulta integração e manutenção
- **Solução**: Gerar documentação automaticamente e validar

#### 7. **Falta de Rate Limiting**
- **Problema**: Sem proteção contra abuso
- **Impacto**: Vulnerável a ataques DDoS
- **Solução**: Implementar rate limiting no API Gateway ou middleware

#### 8. **Transações DynamoDB Limitadas**
- **Problema**: Transações podem ser complexas de gerenciar
- **Impacto**: Possível inconsistência em operações complexas
- **Solução**: Padrões de transação mais claros e documentados

---

## 🏗️ Arquitetura Proposta para Artemis

### Visão Geral

A arquitetura proposta mantém os pontos fortes do Grypp e adiciona melhorias baseadas nas lições aprendidas.

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Handlers   │  │  Middlewares │  │   Adapters   │      │
│  │  (Lambda)    │  │  (Auth, Log) │  │ (Request/    │      │
│  │              │  │              │  │  Response)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼─────────────┐
│         │                  │                  │              │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐      │
│  │ Controllers  │  │   Services   │  │ Repositories │      │
│  │              │  │              │  │              │      │
│  │ - Validation │  │ - Business   │  │ - Data       │      │
│  │ - Adapter    │  │   Logic      │  │   Access     │      │
│  │              │  │ - Domain     │  │ - Mapping    │      │
│  │              │  │   Rules      │  │              │      │
│  └──────────────┘  └──────┬───────┘  └──────┬───────┘      │
│                            │                  │              │
│  ┌──────────────────────────▼──────────────────▼──────┐     │
│  │              Domain Layer (Core)                   │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │     │
│  │  │ Entities │  │  Value   │  │  Domain  │        │     │
│  │  │          │  │  Objects │  │  Events  │        │     │
│  │  └──────────┘  └──────────┘  └──────────┘        │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │           Infrastructure Layer                      │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │     │
│  │  │ Database │  │ Providers│  │   Libs   │        │     │
│  │  │ (Dynamo) │  │ (Auth,   │  │ (Logger, │        │     │
│  │  │          │  │  Email)  │  │  etc)    │        │     │
│  │  └──────────┘  └──────────┘  └──────────┘        │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

### Estrutura de Diretórios Proposta

```
apps/api/src/
├── app/                          # Application Layer
│   ├── config/                   # Configurações
│   │   ├── environment.ts
│   │   ├── tables.ts
│   │   └── logger.ts             # ✨ NOVO: Configuração de logger
│   │
│   ├── database/                 # Data Access
│   │   ├── database.ts           # Cliente DynamoDB
│   │   ├── repositories/         # Repositories por entidade
│   │   │   ├── user/
│   │   │   │   ├── repository.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── mapper.ts     # ✨ NOVO: Mappers separados
│   │   │   └── ...
│   │   └── seed/                 # Seeds para desenvolvimento
│   │
│   ├── errors/                   # Error Classes
│   │   ├── app-error.ts
│   │   ├── server-error.ts
│   │   ├── zod.ts
│   │   └── domain-errors/        # ✨ NOVO: Erros de domínio
│   │
│   ├── interfaces/               # Contratos
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── repository.ts         # ✨ NOVO: Interface base para repos
│   │   ├── http.ts
│   │   └── middleware.ts
│   │
│   ├── middlewares/              # ✨ NOVO: Middlewares
│   │   ├── authentication.ts
│   │   ├── authorization.ts      # ✨ NOVO: Controle de permissões
│   │   ├── logging.ts            # ✨ NOVO: Logging estruturado
│   │   ├── rate-limit.ts         # ✨ NOVO: Rate limiting
│   │   └── error-handler.ts      # ✨ NOVO: Error handling middleware
│   │
│   ├── modules/                  # Módulos de negócio
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   │   ├── signin/
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── schema.ts # Zod para body (pode reutilizar DTO do service)
│   │   │   │   │   ├── controller.spec.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── ...
│   │   │   ├── services/
│   │   │   │   ├── signin/
│   │   │   │   │   ├── service.ts
│   │   │   │   │   ├── service.spec.ts
│   │   │   │   │   ├── dto.ts    # DTOs tipados (Zod + tipos input/output)
│   │   │   │   │   └── index.ts
│   │   │   │   └── ...
│   │   │   ├── mappers/          # (opcional) conversão domínio → contrato HTTP
│   │   │   ├── errors/           # Erros específicos do módulo
│   │   │   └── types.ts
│   │   └── ...
│   │
│   ├── providers/                # Providers externos
│   │   ├── auth/
│   │   ├── email/
│   │   └── ...
│   │
│   └── utils/                    # Utilitários
│       ├── error-handler.ts
│       ├── missing-fields.ts
│       ├── logger.ts             # ✨ NOVO: Logger helper
│       └── ...
│
├── core/                         # Domain Layer
│   └── domain/
│       ├── base.ts
│       ├── user/
│       │   ├── user.ts
│       │   ├── role.ts
│       │   └── events.ts         # ✨ NOVO: Domain events
│       └── ...
│
├── factories/                    # Dependency Injection
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── providers/
│   ├── middlewares/              # ✨ NOVO: Factory de middlewares
│   └── config/
│
└── server/                       # Infrastructure Layer
    ├── adapters/
    │   ├── request.ts
    │   ├── response.ts
    │   └── body-parser.ts
    │
    └── functions/                # Lambda Handlers
        ├── auth/
        │   ├── signin/
        │   │   ├── handler.ts
        │   │   ├── index.ts
        │   │   └── handler.doc.yml
        │   └── ...
        └── ...
```

---

## 🎯 Melhorias Propostas

### 1. **Sistema de Middlewares** ⭐

**Problema resolvido**: Cross-cutting concerns repetidos

**Implementação**:
```typescript
// app/middlewares/authentication.ts
export class AuthenticationMiddleware implements IMiddleware {
  async handle(request: IRequest): Promise<IRequest> {
    // Valida token e adiciona userId ao request
    return request;
  }
}

// Uso no handler
const middlewares = [
  makeLoggingMiddleware(),
  makeAuthenticationMiddleware(),
  makeAuthorizationMiddleware(['ADMIN']),
];
```

**Benefícios**:
- Reutilização de código
- Orquestração clara de cross-cutting concerns
- Fácil adicionar novos middlewares

### 2. **Logging Estruturado** ⭐

**Problema resolvido**: Debugging difícil em produção

**Implementação**:
```typescript
// app/utils/logger.ts
import { logger } from '@shared/logger';

export const appLogger = {
  info: (message: string, meta?: object) => 
    logger.info({ ...meta, message }),
  error: (error: Error, meta?: object) => 
    logger.error({ ...meta, error: error.message, stack: error.stack }),
  // ...
};
```

**Benefícios**:
- Logs estruturados (JSON)
- Contexto rico (requestId, userId, etc)
- Facilita análise em CloudWatch

### 3. **DTOs Tipados nos Services** ⭐

**Problema resolvido**: Validação apenas no controller

**Implementação**:
```typescript
// app/modules/auth/services/signin/dto.ts
export const SigninInputDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SigninInput = z.infer<typeof SigninInputDTO>;

// Service valida também
export class SigninService {
  async execute(input: SigninInput): Promise<SigninOutput> {
    // Service recebe dados já validados
  }
}
```

**Benefícios**:
- Type safety em todas as camadas
- Validação dupla (defesa em profundidade)
- Services podem ser chamados diretamente com segurança

### 4. **Mappers Separados dos Repositories** ⭐

**Problema resolvido**: Repositories com lógica de transformação

**Implementação**:
```typescript
// app/database/repositories/user/mapper.ts
export class UserMapper {
  static toDomain(dynamoItem: UserDynamoDB): User {
    return {
      id: dynamoItem.id,
      email: dynamoItem.email,
      // ...
    };
  }

  static toDynamo(user: User): UserDynamoDB {
    return {
      id: user.id,
      email: user.email,
      PK: `USER#${user.id}`,
      SK: 'PROFILE',
      // ...
    };
  }
}
```

**Benefícios**:
- Repositories focados apenas em acesso a dados
- Mappers testáveis isoladamente
- Facilita mudanças no schema do DynamoDB

### 5. **Sistema de Autorização** ⭐

**Problema resolvido**: Controle de permissões manual

**Implementação**:
```typescript
// app/middlewares/authorization.ts
export class AuthorizationMiddleware implements IMiddleware {
  constructor(private requiredRoles: Role[]) {}

  async handle(request: IRequest): Promise<IRequest> {
    const user = await this.getUser(request.userId);
    
    if (!this.hasRequiredRole(user.role)) {
      throw new ForbiddenError();
    }
    
    return request;
  }
}
```

**Benefícios**:
- Controle de acesso centralizado
- Fácil adicionar novos roles
- Menos código repetido

### 6. **Rate Limiting** ⭐

**Problema resolvido**: Proteção contra abuso

**Implementação**:
```typescript
// app/middlewares/rate-limit.ts
export class RateLimitMiddleware implements IMiddleware {
  async handle(request: IRequest): Promise<IRequest> {
    const key = this.getKey(request);
    const count = await this.redis.incr(key);
    
    if (count > this.limit) {
      throw new RateLimitError();
    }
    
    return request;
  }
}
```

**Benefícios**:
- Proteção contra DDoS
- Pode usar DynamoDB ou Redis
- Configurável por endpoint

### 7. **Domain Events** ⭐

**Problema resolvido**: Acoplamento entre módulos

**Implementação**:
```typescript
// core/domain/user/events.ts
export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly timestamp: Date
  ) {}
}

// Service dispara evento
await this.eventBus.publish(new UserCreatedEvent(user.id, user.email));
```

**Benefícios**:
- Desacoplamento entre módulos
- Facilita extensibilidade
- Padrão bem estabelecido (DDD)

### 8. **Testes de Integração** ⭐

**Problema resolvido**: Garantia de funcionamento end-to-end

**Implementação**:
```typescript
// tests/integration/auth/signin.test.ts
describe('Signin Integration', () => {
  it('should signin successfully', async () => {
    // Setup DynamoDB local
    // Execute handler
    // Assert response
  });
});
```

**Benefícios**:
- Confiança em deploy
- Detecta problemas de integração
- Documentação viva

### 9. **OpenAPI Documentation Automática** ⭐

**Problema resolvido**: Documentação desatualizada

**Implementação**:
```yaml
# server/functions/auth/signin/handler.doc.yml
signin:
  summary: User signin
  description: Authenticate user with email and password
  requestBody:
    content:
      application/json:
        schema:
          type: object
          properties:
            email:
              type: string
            password:
              type: string
  responses:
    200:
      description: Success
```

**Benefícios**:
- Documentação sempre atualizada
- Validação de contratos
- Geração de client SDK

### 10. **Transaction Patterns** ⭐

**Problema resolvido**: Transações complexas mal gerenciadas

**Implementação**:
```typescript
// app/database/transactions/user-workout.ts
export class UserWorkoutTransaction {
  async execute(user: User, workout: Workout): Promise<void> {
    await this.db.transactWrite({
      TransactItems: [
        { Put: { Item: userMapper.toDynamo(user) } },
        { Put: { Item: workoutMapper.toDynamo(workout) } },
      ],
    });
  }
}
```

**Benefícios**:
- Transações documentadas
- Reutilizáveis
- Fácil de testar

---

## 📊 Comparação: Grypp vs Artemis (Proposta)

| Aspecto | Grypp | Artemis (Proposta) |
|---------|-------|-------------------|
| **Separação de Camadas** | ✅ Excelente | ✅ Mantido |
| **Factory Pattern** | ✅ Implementado | ✅ Mantido |
| **Validação** | ⚠️ Apenas Controller | ✅ Controller + Service |
| **Error Handling** | ✅ Centralizado | ✅ Melhorado com middlewares |
| **Logging** | ❌ Console.log | ✅ Estruturado |
| **Middlewares** | ❌ Não existe | ✅ Sistema completo |
| **Autorização** | ⚠️ Manual | ✅ Middleware dedicado |
| **Rate Limiting** | ❌ Não existe | ✅ Implementado |
| **Domain Events** | ❌ Não existe | ✅ Implementado |
| **Testes** | ⚠️ Apenas unitários | ✅ Unitários + Integração |
| **Documentação** | ⚠️ Manual | ✅ Automática |
| **Mappers** | ⚠️ No Repository | ✅ Separados |
| **DTOs** | ⚠️ Apenas schemas | ✅ Tipados e validados |

---

## 🚀 Plano de Implementação Sugerido

### Fase 1: Fundação (Semana 1-2)
1. ✅ Estrutura de diretórios base
2. ✅ Sistema de middlewares
3. ✅ Logging estruturado
4. ✅ Error handling melhorado

### Fase 2: Core Features (Semana 3-4)
5. ✅ DTOs tipados
6. ✅ Mappers separados
7. ✅ Sistema de autorização
8. ✅ Primeiro módulo completo (ex: auth)

### Fase 3: Melhorias (Semana 5-6)
9. ✅ Rate limiting
10. ✅ Domain events
11. ✅ Testes de integração
12. ✅ Documentação OpenAPI

### Fase 4: Otimizações (Semana 7+)
13. ✅ Transaction patterns
14. ✅ Performance tuning
15. ✅ Monitoring e observability

---

## 🎓 Princípios Arquiteturais

### 1. **Clean Architecture**
- Dependências apontam para dentro
- Domain layer independente
- Infrastructure isolada

### 2. **SOLID**
- **S**ingle Responsibility: Cada classe uma responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Interfaces bem definidas
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Depender de abstrações

### 3. **DRY (Don't Repeat Yourself)**
- Middlewares para lógica repetida
- Factories para criação de objetos
- Utils para funções comuns

### 4. **KISS (Keep It Simple, Stupid)**
- Evitar over-engineering
- Priorizar simplicidade
- Adicionar complexidade apenas quando necessário

### 5. **YAGNI (You Aren't Gonna Need It)**
- Não implementar features "por precaução"
- Focar no que é necessário agora
- Refatorar quando necessário

---

## 📝 Conclusão

A arquitetura proposta mantém os **pontos fortes do Grypp** (separação de camadas, factories, validação) e adiciona **melhorias significativas** baseadas em boas práticas e lições aprendidas.

**Principais ganhos**:
- ✅ Código mais manutenível
- ✅ Melhor observabilidade
- ✅ Maior segurança
- ✅ Testes mais abrangentes
- ✅ Documentação automática
- ✅ Escalabilidade melhorada

**Próximos passos**:
1. Revisar proposta com time
2. Priorizar melhorias
3. Implementar fase por fase
4. Validar com código real

---

**Documento criado em**: 2026-01-23  
**Versão**: 1.0.0
