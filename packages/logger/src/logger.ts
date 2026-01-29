import type { Logger, LoggerContext } from "./types.js";
import { LogLevel } from "./types.js";

const ANSI = {
	reset: "\x1b[0m",
	blue: "\x1b[34m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
	white: "\x1b[37m",
} as const;

function colorizeLevel(level: string): string {
	switch (level) {
		case "INFO":
			return `${ANSI.blue}${level}${ANSI.reset}`;
		case "WARN":
			return `${ANSI.yellow}${level}${ANSI.reset}`;
		case "ERROR":
			return `${ANSI.red}${level}${ANSI.reset}`;
		case "DEBUG":
			return `${ANSI.white}${level}${ANSI.reset}`;
		default:
			return level;
	}
}

interface LoggerOptions {
	context?: LoggerContext | string;
	minLevel: LogLevel;
	prettyPrint: boolean;
}

export class LoggerImpl implements Logger {
	private context: LoggerContext;
	private minLevel: LogLevel;
	private prettyPrint: boolean;

	constructor(options: LoggerOptions) {
		this.minLevel = options.minLevel;
		this.prettyPrint = options.prettyPrint;
		this.context = this.normalizeContext(options.context);
	}

	private normalizeContext(context?: LoggerContext | string): LoggerContext {
		if (!context) {
			return {};
		}

		if (typeof context === "string") {
			return { module: context };
		}

		return context;
	}

	private getTimestamp(): string {
		const now = new Date();
		return now.toTimeString().slice(0, 8); // "HH:mm:ss"
	}

	private formatMessage(level: string, ...args: unknown[]): unknown[] {
		const contextStr = this.formatContext();
		const modulePrefix = contextStr ? `[${contextStr}]` : "";

		if (!this.prettyPrint) {
			const prefix = modulePrefix || "";
			return prefix ? [prefix, ...args] : args;
		}

		// Format: LEVEL [HH:mm:ss]: [module] message (LEVEL is colorized)
		const timeStr = this.getTimestamp();
		const coloredLevel = colorizeLevel(level);
		const prefix =
			`${coloredLevel} [${timeStr}]: ${modulePrefix ? `${modulePrefix} ` : " "}`.trimEnd();
		return [prefix, ...args];
	}

	private formatContext(): string {
		const parts: string[] = [];

		if (this.context.module) {
			parts.push(this.context.module);
		}

		if (this.context.component) {
			parts.push(this.context.component);
		}

		return parts.join(":");
	}

	private shouldLog(level: LogLevel): boolean {
		return level >= this.minLevel;
	}

	debug(...args: unknown[]): void {
		if (!this.shouldLog(LogLevel.DEBUG)) {
			return;
		}

		const formatted = this.formatMessage("DEBUG", ...args);
		console.debug(...formatted);
	}

	info(...args: unknown[]): void {
		if (!this.shouldLog(LogLevel.INFO)) {
			return;
		}

		const formatted = this.formatMessage("INFO", ...args);
		console.info(...formatted);
	}

	warn(...args: unknown[]): void {
		if (!this.shouldLog(LogLevel.WARN)) {
			return;
		}

		const formatted = this.formatMessage("WARN", ...args);
		console.warn(...formatted);
	}

	error(...args: unknown[]): void {
		if (!this.shouldLog(LogLevel.ERROR)) {
			return;
		}

		const formatted = this.formatMessage("ERROR", ...args);
		console.error(...formatted);
	}
}
