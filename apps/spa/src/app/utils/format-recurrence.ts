import type { Recurrence } from "@repo/contracts/tasks/entities";

const DAY_NAMES_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

/**
 * Converts a `Recurrence` entity (from the API/contracts) to a concise
 * human-readable string for display in task cards and tooltips.
 *
 * Examples:
 *   daily                         → "Daily"
 *   weekly, days [1,3,5]          → "Weekly (Mo, We, Fr)"
 *   monthly                       → "Monthly"
 *   yearly                        → "Yearly"
 *
 * Returns an empty string when recurrence is not enabled.
 */
export function formatRecurrencePreview(recurrence: Recurrence | null): string {
	if (!recurrence?.enabled) return "";

	const { frequency } = recurrence;

	if (frequency === "daily") return "Daily";

	if (frequency === "weekly") {
		const days =
			recurrence.weeklyDays?.length &&
			recurrence.weeklyDays.length > 0 &&
			recurrence.weeklyDays.length < 7
				? recurrence.weeklyDays
						.slice()
						.sort((a, b) => a - b)
						.map((d) => DAY_NAMES_SHORT[d])
						.join(", ")
				: null;
		return days ? `Weekly (${days})` : "Weekly";
	}

	if (frequency === "monthly") return "Monthly";
	if (frequency === "yearly") return "Yearly";

	return "";
}
