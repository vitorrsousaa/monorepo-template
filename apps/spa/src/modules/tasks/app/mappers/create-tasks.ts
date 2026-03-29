import { localDateToUTCMidnightISO } from "@/utils/date-utils";
import type { CreateTaskInput } from "@repo/contracts/tasks/create";
import type { TTaskFormSchema } from "../../view/forms/task/task-form.schema";

/**
 * Maps task form schema (from UI) to API request input.
 *
 * Transformations:
 * - `project` → `projectId` (API field naming)
 * - `section` → `sectionId` (API field naming)
 * - `priority: "none"` → `null` (API expects null for no priority)
 * - `dueDate: Date` → ISO string (API expects ISO 8601 format)
 * - `recurrence.enabled === true` → include recurrence object with endDate converted to YYYY-MM-DD string
 * - `recurrence.enabled === false` or absent → `recurrence: null`
 * - Omits fields not needed by API: id, completed, goal
 */
export function mapTaskFormToCreateInput(
	formData: TTaskFormSchema,
): CreateTaskInput {
	const recurrence = formData.recurrence;
	const mappedRecurrence =
		recurrence?.enabled && recurrence.frequency && recurrence.endType
			? {
					enabled: true as const,
					frequency: recurrence.frequency,
					weeklyDays: recurrence.weeklyDays,
					endType: recurrence.endType,
					endDate: recurrence.endDate
						? recurrence.endDate.toISOString().slice(0, 10)
						: undefined,
					endCount: recurrence.endCount,
				}
			: null;

	return {
		title: formData.title,
		description: formData.description || null,
		projectId: formData.project === "inbox" ? null : formData.project,
		sectionId: formData.section === "none" ? null : formData.section,
		priority: formData.priority === "none" ? null : formData.priority,
		dueDate: formData.dueDate
			? localDateToUTCMidnightISO(formData.dueDate)
			: null,
		recurrence: mappedRecurrence,
	};
}
