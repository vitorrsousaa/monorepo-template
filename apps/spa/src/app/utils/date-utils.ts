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
