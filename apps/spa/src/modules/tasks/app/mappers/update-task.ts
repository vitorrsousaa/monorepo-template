import { PROJECTS_DEFAULT_IDS } from "@repo/contracts/enums";
import type { UpdateTaskInput } from "@repo/contracts/tasks/update";
import type { TTaskFormSchema } from "../../view/forms/task/task-form.schema";

/**
 * Maps task form schema (from UI) to API update request input.
 *
 * Transformations:
 * - `priority: "none"` → `null` (API expects null for no priority)
 * - `dueDate: Date` → ISO string (API expects ISO 8601 format)
 * - `recurrence.enabled: true` → includes full recurrence object
 * - `recurrence.enabled: false` or absent → `null` (disables recurrence)
 * - `recurrence.endDate: Date` → ISO string
 * - Omits: project, section, id, completed, goal (not part of update contract)
 */
export function mapTaskFormToUpdateInput(
	formData: TTaskFormSchema,
): UpdateTaskInput {
	const { recurrence } = formData;

	let mappedRecurrence: UpdateTaskInput["recurrence"] = null;

	if (recurrence?.enabled && recurrence) {
		mappedRecurrence = {
			enabled: recurrence.enabled,
			frequency: recurrence?.frequency ?? "daily",
			weeklyDays: recurrence.weeklyDays,
			endType: recurrence?.endType ?? "never",
			endDate: recurrence.endDate
				? recurrence.endDate.toISOString()
				: undefined,
			endCount: recurrence.endCount,
		};
	}

	return {
		title: formData.title,
		description: formData.description || null,
		priority: formData.priority === "none" ? null : formData.priority,
		dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
		recurrence: mappedRecurrence,
		sectionId:
			formData.section === PROJECTS_DEFAULT_IDS.INBOX ? null : formData.section,
	};
}
