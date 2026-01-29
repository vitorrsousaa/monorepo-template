import { LoggerImpl } from "./logger.js";
import type {
	Logger,
	LoggerContext,
	LoggerInstrumentorConfig,
} from "./types.js";
import { LogLevel } from "./types.js";

interface InternalConfig {
	logger: {
		prettyPrint: boolean;
		minLevel: LogLevel;
	};
}

export class LoggerInstrumentor {
	private config: InternalConfig;
	private defaultLogger: Logger;

	constructor(config: LoggerInstrumentorConfig = {}) {
		this.config = {
			logger: {
				prettyPrint: config.logger?.prettyPrint ?? false,
				minLevel: config.logger?.minLevel ?? LogLevel.INFO,
			},
		};

		this.defaultLogger = new LoggerImpl({
			minLevel: this.config.logger.minLevel,
			prettyPrint: this.config.logger.prettyPrint,
		});
	}

	getLogger(): Logger {
		return this.defaultLogger;
	}

	createLogger(context: LoggerContext | string): Logger {
		return new LoggerImpl({
			context,
			minLevel: this.config.logger.minLevel,
			prettyPrint: this.config.logger.prettyPrint,
		});
	}
}
