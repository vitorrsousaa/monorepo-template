import type { Task } from "../entities";

/**
 * Calculates the next due date for a recurring task (same rules as API recurrence).
 * Returns YYYY-MM-DD or null.
 */
export function calculateNextDueDate(task: Task): string | null {
	if (!task.recurrence || !task.recurrence.enabled) {
		return null;
	}

	const recurrence = task.recurrence;
	const baseDateStr = task.dueDate ?? task.completedAt;
	if (!baseDateStr) {
		return null;
	}

	const baseDate = parseDateString(baseDateStr);

	switch (recurrence.frequency) {
		case "daily":
			return formatDate(addDays(baseDate, 1));

		case "weekly":
			return calculateNextWeeklyDate(recurrence.weeklyDays ?? []);

		case "monthly":
			return formatDate(calculateNextMonthlyDate(baseDate));

		case "yearly":
			return formatDate(calculateNextYearlyDate(baseDate));

		default:
			return null;
	}
}

function parseDateString(dateStr: string): Date {
	const datePart = dateStr.slice(0, 10);
	const parts = datePart.split("-").map(Number);
	const year = parts[0];
	const month = parts[1];
	const day = parts[2];
	if (
		year === undefined ||
		month === undefined ||
		day === undefined ||
		Number.isNaN(year) ||
		Number.isNaN(month) ||
		Number.isNaN(day)
	) {
		return new Date(NaN);
	}
	return new Date(year, month - 1, day);
}

function formatDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function calculateNextWeeklyDate(weeklyDays: number[]): string | null {
	if (weeklyDays.length === 0) {
		return null;
	}

	const today = new Date();
	const todayDayOfWeek = today.getDay();

	const sortedDays = [...weeklyDays].sort((a, b) => a - b);
	const nextDayThisWeek = sortedDays.find((d) => d > todayDayOfWeek);

	let daysUntilNext: number;
	if (nextDayThisWeek !== undefined) {
		daysUntilNext = nextDayThisWeek - todayDayOfWeek;
	} else {
		const firstDayNextWeek = sortedDays[0];
		if (firstDayNextWeek === undefined) {
			return null;
		}
		daysUntilNext = 7 - todayDayOfWeek + firstDayNextWeek;
	}

	const nextDate = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() + daysUntilNext,
	);
	return formatDate(nextDate);
}

function calculateNextMonthlyDate(baseDate: Date): Date {
	const day = baseDate.getDate();
	const nextMonth = baseDate.getMonth() + 1;
	const year =
		nextMonth > 11 ? baseDate.getFullYear() + 1 : baseDate.getFullYear();
	const month = nextMonth > 11 ? 0 : nextMonth;
	const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
	const clampedDay = Math.min(day, lastDayOfMonth);
	return new Date(year, month, clampedDay);
}

function calculateNextYearlyDate(baseDate: Date): Date {
	const nextYear = baseDate.getFullYear() + 1;
	const month = baseDate.getMonth();
	const day = baseDate.getDate();
	const lastDayOfMonth = new Date(nextYear, month + 1, 0).getDate();
	const clampedDay = Math.min(day, lastDayOfMonth);
	return new Date(nextYear, month, clampedDay);
}
