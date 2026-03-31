# @repo/logger — Claude Context

Lightweight logging utility with context metadata, level filtering, and optional pretty-printing. Works in Node.js and browser.

## Structure

```
src/
├── types.ts          # LogLevel enum, Logger/LoggerConfig/LoggerContext interfaces
├── logger.ts         # LoggerImpl — core logger with level filtering + formatting
├── instrumentor.ts   # LoggerInstrumentor — factory for creating loggers
└── index.ts          # Public exports
```

## API

```ts
import { LogLevel, LoggerInstrumentor } from "@repo/logger";

// Create instrumentor (once per app)
const instrumentor = new LoggerInstrumentor({
  logger: { prettyPrint: true, minLevel: LogLevel.DEBUG },
});

// Create contextual loggers
const logger = instrumentor.createLogger({ module: "tasks", component: "CreateService" });
// or shorthand
const logger = instrumentor.createLogger("tasks");

logger.debug("processing...");
logger.info("task created", { id: "t-1" });
logger.warn("retrying");
logger.error("failed", error);
```

## Log Levels

| Level | Value | Color (pretty) |
|-------|-------|-----------------|
| `DEBUG` | 0 | White |
| `INFO` | 1 | Blue |
| `WARN` | 2 | Yellow |
| `ERROR` | 3 | Red |

Logs below `minLevel` are silently skipped.

## Pretty Format

When `prettyPrint: true`:
```
INFO [14:32:05]: [tasks:CreateService] task created
```

When `prettyPrint: false` (production):
```
[tasks:CreateService] task created
```

## Usage in Apps

Both API and SPA wrap the instrumentor in `app/utils/logger.ts`:

```ts
// apps/api/src/app/utils/logger.ts (identical pattern in SPA)
import { LogLevel, LoggerInstrumentor } from "@repo/logger";

const instrumentor = new LoggerInstrumentor({
  logger: { prettyPrint: true, minLevel: LogLevel.DEBUG },
});

export const createLogger = instrumentor.createLogger.bind(instrumentor);
```

## Build

- **Bundler:** tsup
- **Format:** ESM + CJS dual package
- **Entry:** `src/index.ts`
- **Exports:** `LoggerImpl`, `LoggerInstrumentor`, `LogLevel`, type interfaces
