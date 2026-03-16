import { useGetAllGoals } from "@/modules/goals/app/hooks/use-get-all-goals";
import { useGetAllProjectsByUser } from "@/modules/projects/app/hooks/use-get-all-projects-by-user";
import { useGetAllSectionsByProject } from "@/modules/sections/app/hooks/use-get-all-sections-by-project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { TaskFormProps } from "./task-form";
import { getTaskFormValues, TaskFormSchema } from "./task-form.schema";

export const useTaskFormHook = (props: TaskFormProps) => {
	const { initialValues } = props;
	const { projects } = useGetAllProjectsByUser();
	const { goals } = useGetAllGoals();

	const methods = useForm({
		resolver: zodResolver(TaskFormSchema),
		defaultValues: getTaskFormValues(initialValues),
	});

	const selectedProjectId = methods.watch("project");
	const isProjectSelected =
		!!selectedProjectId && selectedProjectId !== "inbox";

	const { sections, isFetchingSections, refetchSections } =
		useGetAllSectionsByProject({
			projectId: selectedProjectId ?? "",
			enabled: isProjectSelected,
		});

	const handleProjectChange = (value: string) => {
		methods.setValue("project", value);
		methods.setValue("section", "none");
	};

	const { handleSubmit: hookFormSubmit } = methods;

	const handleSubmit = hookFormSubmit(async (data) => {
		const projectId = data.project === "inbox" ? undefined : data.project;
		const sectionId = data.section === "none" ? undefined : data.section;
		const priority = data.priority === "none" ? undefined : data.priority;
		const dueDate = data.dueDate;

		console.log({ ...data, projectId, sectionId, priority, dueDate });
	});

	return {
		methods,
		projects,
		goals,
		sections,
		isFetchingSections,
		isProjectSelected,
		refetchSections,
		handleProjectChange,
		handleSubmit,
	};
};
