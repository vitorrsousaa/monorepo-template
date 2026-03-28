import type { Task } from "@repo/contracts/tasks/entities";

/**
 * Calculates the next due date for a recurring task.
 * Returns an ISO date string (YYYY-MM-DD) or null if the task is not recurring.
 */
export function calculateNextDueDate(task: Task): string | null {
	if (!task.recurrence || !task.recurrence.enabled) {
		return null;
	}

	const recurrence = task.recurrence;

	// Determine base date: prefer dueDate, fall back to completedAt
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

/**
 * Parses an ISO date string or ISO datetime string into a Date object
 * using the date portion only (to avoid timezone drift).
 */
function parseDateString(dateStr: string): Date {
	// Take only YYYY-MM-DD portion to avoid timezone issues
	const datePart = dateStr.slice(0, 10);
	const [year, month, day] = datePart.split("-").map(Number);
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

/**
 * Weekly: find next matching day from weeklyDays starting from TODAY (not base date).
 * If today is already in weeklyDays, pick the NEXT one after today.
 */
function calculateNextWeeklyDate(weeklyDays: number[]): string | null {
	if (weeklyDays.length === 0) {
		return null;
	}

	const today = new Date();
	const todayDayOfWeek = today.getDay(); // 0=Sun..6=Sat

	// Sort ascending
	const sortedDays = [...weeklyDays].sort((a, b) => a - b);

	// Find the next day strictly after today in this week
	const nextDayThisWeek = sortedDays.find((d) => d > todayDayOfWeek);

	let daysUntilNext: number;
	if (nextDayThisWeek !== undefined) {
		daysUntilNext = nextDayThisWeek - todayDayOfWeek;
	} else {
		// Wrap around: next occurrence is in next week
		const firstDayNextWeek = sortedDays[0];
		daysUntilNext = 7 - todayDayOfWeek + firstDayNextWeek;
	}

	const nextDate = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() + daysUntilNext,
	);
	return formatDate(nextDate);
}

/**
 * Monthly: same day-of-month, next month. Clamps to last day if the day doesn't exist.
 */
function calculateNextMonthlyDate(baseDate: Date): Date {
	const day = baseDate.getDate();
	const nextMonth = baseDate.getMonth() + 1;
	const year =
		nextMonth > 11 ? baseDate.getFullYear() + 1 : baseDate.getFullYear();
	const month = nextMonth > 11 ? 0 : nextMonth;

	// Clamp day to last day of the target month
	const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
	const clampedDay = Math.min(day, lastDayOfMonth);

	return new Date(year, month, clampedDay);
}

/**
 * Yearly: same month+day, next year. Handles Feb 29 → Feb 28 on non-leap years.
 */
function calculateNextYearlyDate(baseDate: Date): Date {
	const nextYear = baseDate.getFullYear() + 1;
	const month = baseDate.getMonth();
	const day = baseDate.getDate();

	// Clamp day to last day of the target month in next year (handles Feb 29 → Feb 28)
	const lastDayOfMonth = new Date(nextYear, month + 1, 0).getDate();
	const clampedDay = Math.min(day, lastDayOfMonth);

	return new Date(nextYear, month, clampedDay);
}
