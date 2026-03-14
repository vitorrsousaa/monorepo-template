import type { TRecurrenceForm } from "./todo-form.schema";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatRecurrencePreview(recurrence: TRecurrenceForm | undefined): string {
	if (!recurrence?.enabled || !recurrence.frequency) {
		return "";
	}

	const freq = recurrence.frequency;
	let base = "";
	if (freq === "daily") base = "Repeats every day";
	else if (freq === "weekly") {
		const days =
			recurrence.weeklyDays?.length &&
			recurrence.weeklyDays.length > 0 &&
			recurrence.weeklyDays.length < 7
				? recurrence.weeklyDays
						.sort((a, b) => a - b)
						.map((d) => DAY_NAMES[d])
						.join(", ")
				: null;
		base = days ? `Repeats every week on ${days}` : "Repeats every week";
	} else if (freq === "monthly") base = "Repeats every month";
	else if (freq === "yearly") base = "Repeats every year";
	else return "";

	const endType = recurrence.endType ?? "never";
	if (endType === "on_date" && recurrence.endDate) {
		const d = recurrence.endDate;
		const dateStr =
			d instanceof Date
				? d.toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})
				: new Date(d).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					});
		return `${base} · until ${dateStr}`;
	}
	if (endType === "after_count" && recurrence.endCount != null) {
		return `${base} · ${recurrence.endCount} times`;
	}
	return base;
}
