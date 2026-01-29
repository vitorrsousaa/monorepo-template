import { LoggerInstrumentor, LogLevel } from "@repo/logger";

const instrumentor = new LoggerInstrumentor({
	logger: {
		prettyPrint: process.env.NODE_ENV === "development",
		minLevel: LogLevel.INFO,
	},
});

export const createLogger = instrumentor.createLogger.bind(instrumentor);
export const getLogger = instrumentor.getLogger.bind(instrumentor);
