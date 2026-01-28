# @repo/logger

Shared logging package that works in both Node.js and React/Browser environments.

## Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API](#api)
- [Examples](#examples)

## Installation

```sh
pnpm add @repo/logger
```

## Basic Usage

### Initial Configuration

```typescript
import { LoggerInstrumentor, LogLevel } from "@repo/logger";

const loggerInstrumentor = new LoggerInstrumentor({
  logger: {
    prettyPrint: true, // Pretty log formatting
    minLevel: LogLevel.DEBUG, // Minimum log level
  },
});
```

### Create a Logger with Context

```typescript
// With context object
const logger = loggerInstrumentor.createLogger({
  module: "event-emitter",
  component: "EventBus",
});

// Or with string (will be used as module)
const logger = loggerInstrumentor.createLogger("event-emitter");

// Use the logger
logger.debug("Debug message");
logger.info("Info message");
logger.warn("Warning message");
logger.error("Error message");
```

### Default Logger (without context)

```typescript
const logger = loggerInstrumentor.getLogger();

logger.info("Log without specific context");
```

## API

### LoggerInstrumentor

Main class for configuring and managing loggers.

#### Constructor

```typescript
new LoggerInstrumentor(config?: LoggerInstrumentorConfig)
```

**Config:**

- `logger.prettyPrint?: boolean` - Enables pretty log formatting (default: `false`)
- `logger.minLevel?: LogLevel` - Minimum log level (default: `LogLevel.INFO`)

#### Methods

- `getLogger(): Logger` - Returns default logger without context
- `createLogger(context: LoggerContext | string): Logger` - Creates logger with context

### Logger

Logger interface with the following methods:

- `debug(...args: unknown[]): void`
- `info(...args: unknown[]): void`
- `warn(...args: unknown[]): void`
- `error(...args: unknown[]): void`

### LogLevel

Enum with log levels:

- `LogLevel.DEBUG` (0) - Debug logs
- `LogLevel.INFO` (1) - General information
- `LogLevel.WARN` (2) - Warnings
- `LogLevel.ERROR` (3) - Errors

### LoggerContext

Context object to identify modules/components:

```typescript
interface LoggerContext {
  module?: string;
  component?: string;
  [key: string]: unknown; // Custom fields
}
```

## Examples

### Complete Example

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

// Usage
const logger = createLogger({
  module: "event-emitter",
});

logger.info("Event emitted", { eventName: "user.created" });
```

### Usage in Node.js

```typescript
// apps/api/src/utils/logger.ts
import { LoggerInstrumentor, LogLevel } from "@repo/logger";

export const loggerInstrumentor = new LoggerInstrumentor({
  logger: {
    prettyPrint: process.env.NODE_ENV === "development",
    minLevel: LogLevel.INFO,
  },
});

export const createLogger =
  loggerInstrumentor.createLogger.bind(loggerInstrumentor);
```

### Usage in React

```typescript
// apps/web/src/utils/logger.ts
import { LoggerInstrumentor, LogLevel } from "@repo/logger";

export const loggerInstrumentor = new LoggerInstrumentor({
  logger: {
    prettyPrint: import.meta.env.DEV,
    minLevel: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
  },
});

export const createLogger =
  loggerInstrumentor.createLogger.bind(loggerInstrumentor);
```

## Notes

- Currently, the logger is a wrapper around `console.log` and related methods
- In the future, it will be possible to replace with systems like Sentry, CloudWatch, etc.
- The package is compatible with both Node.js and React/Browser

[⬅ Back](../README.md)
