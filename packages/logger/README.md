# @repo/logger

Pacote de logging compartilhado que funciona tanto no Node.js quanto no React/Browser.

## Instalação

```bash
pnpm add @repo/logger
```

## Uso Básico

### Configuração Inicial

```typescript
import { LoggerInstrumentor, LogLevel, type LoggerContext } from "@repo/logger";

const loggerInstrumentor = new LoggerInstrumentor({
  logger: {
    prettyPrint: true, // Formatação bonita dos logs
    minLevel: LogLevel.DEBUG, // Nível mínimo de log
  },
});
```

### Criar um Logger com Contexto

```typescript
// Com objeto de contexto
const logger = loggerInstrumentor.createLogger({
  module: "event-emitter",
  component: "EventBus",
});

// Ou com string (será usado como module)
const logger = loggerInstrumentor.createLogger("event-emitter");

// Usar o logger
logger.debug("Debug message");
logger.info("Info message");
logger.warn("Warning message");
logger.error("Error message");
```

### Logger Padrão (sem contexto)

```typescript
const logger = loggerInstrumentor.getLogger();

logger.info("Log sem contexto específico");
```

## Níveis de Log

- `LogLevel.DEBUG` (0) - Logs de debug
- `LogLevel.INFO` (1) - Informações gerais
- `LogLevel.WARN` (2) - Avisos
- `LogLevel.ERROR` (3) - Erros

## Exemplo Completo

```typescript
import { LoggerInstrumentor, LogLevel, type Logger } from "@repo/logger";

const loggerInstrumentor = new LoggerInstrumentor({
  logger: {
    prettyPrint: process.env.NODE_ENV === "development",
    minLevel:
      process.env.NODE_ENV === "development" ? LogLevel.DEBUG : LogLevel.INFO,
  },
});

export const getLogger = () => loggerInstrumentor.getLogger();
export const createLogger = (context: LoggerContext | string) =>
  loggerInstrumentor.createLogger(context);

// Uso
const logger = createLogger({
  module: "event-emitter",
});

logger.info("Event emitted", { eventName: "user.created" });
```

## Notas

- Por enquanto, o logger é um wrapper do `console.log` e métodos relacionados
- No futuro, será possível substituir por sistemas como Sentry, CloudWatch, etc.
- O pacote é compatível com Node.js e React/Browser
