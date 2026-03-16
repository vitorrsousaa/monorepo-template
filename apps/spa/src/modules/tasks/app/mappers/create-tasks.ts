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
 * - Omits fields not needed by API: id, completed, goal, recurrence
 */
export function mapTaskFormToCreateInput(formData: TTaskFormSchema): CreateTaskInput {
	return {
		title: formData.title,
		description: formData.description || null,
		projectId: formData.project === "inbox" ? null : formData.project,
		sectionId: formData.section === "none" ? null : formData.section,
		priority: formData.priority === "none" ? null : formData.priority,
		dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
	};
}
