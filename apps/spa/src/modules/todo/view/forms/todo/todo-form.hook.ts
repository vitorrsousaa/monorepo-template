import { useGetAllProjectsByUser } from "@/modules/projects/app/hooks/use-get-all-projects-by-user";
import { useGetAllSectionsByProject } from "@/modules/sections/app/hooks/use-get-all-sections-by-project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type { TodoFormProps } from "./todo-form";
import { getTodoFormValues, TodoFormSchema } from "./todo-form.schema";

export const useTodoFormHook = (props: TodoFormProps) => {
	const { initialValues } = props;
	const { projects } = useGetAllProjectsByUser();

	const methods = useForm({
		resolver: zodResolver(TodoFormSchema),
		defaultValues: getTodoFormValues(initialValues),
	});

	// When initialValues change (e.g. modal opened from another section), reset form so project/section show correctly
	useEffect(() => {
		methods.reset(getTodoFormValues(initialValues));
	}, [initialValues, methods.reset]);

	const selectedProjectId = methods.watch("project");
	const isProjectSelected =
		!!selectedProjectId && selectedProjectId !== "inbox";

	const { sections, isFetchingSections, refetchSections } =
		useGetAllSectionsByProject({
			projectId: selectedProjectId ?? "",
			enabled: isProjectSelected,
		});

	// Only reset section to "none" when the user *changes* the project in the dropdown,
	// not on initial mount (so initialValues.section from NewTodoModal is preserved).
	const previousProjectIdRef = useRef<string | undefined>(undefined);

	useEffect(() => {
		const previous = previousProjectIdRef.current;
		previousProjectIdRef.current = selectedProjectId;

		if (previous !== undefined && previous !== selectedProjectId) {
			methods.setValue("section", "none");
		}
	}, [methods, selectedProjectId]);

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
		sections,
		isFetchingSections,
		isProjectSelected,
		refetchSections,
		handleSubmit,
	};
};
