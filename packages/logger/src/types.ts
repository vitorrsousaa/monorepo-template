export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
}

export interface LoggerContext {
	module?: string;
	component?: string;
	[key: string]: unknown;
}

export interface Logger {
	debug(...args: unknown[]): void;
	info(...args: unknown[]): void;
	warn(...args: unknown[]): void;
	error(...args: unknown[]): void;
}

export interface LoggerConfig {
	prettyPrint?: boolean;
	minLevel?: LogLevel;
}

export interface LoggerInstrumentorConfig {
	logger?: LoggerConfig;
}
