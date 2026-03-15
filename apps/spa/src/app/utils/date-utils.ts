/**
 * Utilitários de data usando APIs nativas do JavaScript (Intl, Date).
 * Evita dependência de date-fns para operações comuns.
 */

/** Adiciona N dias a uma data. Retorna nova instância. */
export function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

/** Formata data em pt-BR: "segunda-feira, 10 de março" */
export function formatDateLong(date: Date): string {
	return new Intl.DateTimeFormat("pt-BR", {
		weekday: "long",
		day: "numeric",
		month: "long",
	}).format(date);
}

const ptBRShortMonth = new Intl.DateTimeFormat("pt-BR", { month: "short" });

/** Formata data em pt-BR estilo curto: "13 mar" */
export function formatDateShort(date: Date): string {
	const day = date.getDate();
	const month = ptBRShortMonth.format(date).replace(".", "");
	return `${day} ${month}`;
}

/** Formata data em pt-BR com ano: "13 mar 2026" */
export function formatDateWithYear(date: Date): string {
	const day = date.getDate();
	const month = ptBRShortMonth.format(date).replace(".", "");
	const year = date.getFullYear();
	return `${day} ${month} ${year}`;
}

/** Diferença em dias entre duas datas (dateLeft - dateRight). */
export function differenceInDays(dateLeft: Date, dateRight: Date): number {
	const start = new Date(dateRight);
	const end = new Date(dateLeft);
	start.setHours(0, 0, 0, 0);
	end.setHours(0, 0, 0, 0);
	return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/** Status for due date chip styling: overdue (amber), late (red), ok (neutral). */
export type DueDateChipStatus = "overdue" | "late" | "ok";

/**
 * Returns the chip status for a due date relative to today.
 * - "late": more than 7 days past due
 * - "overdue": past due, up to 7 days
 * - "ok": today or in the future
 * - null: no date
 */
export function getDueDateChipStatus(
	dueDate: string | Date | null | undefined,
): DueDateChipStatus | null {
	if (dueDate == null) return null;
	const date = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	const days = differenceInDays(today, d);
	if (days > 0) return days > 7 ? "late" : "overdue";
	return "ok";
}

/** Short label for due date chip: "Feb 20" or "Mar 9, 2025" when year differs from current. */
export function formatDueDateChip(dueDate: string | Date): string {
	const date = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
	const now = new Date();
	const sameYear = date.getFullYear() === now.getFullYear();
	return sameYear ? formatDateShort(date) : formatDateWithYear(date);
}
