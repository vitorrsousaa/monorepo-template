import { useGetAllProjectsByUser } from "@/modules/projects/app/hooks/use-get-all-projects-by-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { defaultInitialValues, TodoFormSchema } from "./todo-form.schema";

export const useTodoFormHook = () => {
	const { projects } = useGetAllProjectsByUser();

	const methods = useForm({
		resolver: zodResolver(TodoFormSchema),
		defaultValues: defaultInitialValues,
	});
	const { handleSubmit: hookFormSubmit } = methods;

	const handleSubmit = hookFormSubmit(async (data) => {
		const projectId = data.project === "inbox" ? undefined : data.project;
		const priority = data.priority === "none" ? undefined : data.priority;
		const dueDate = data.dueDate;

		console.log({ ...data, projectId, priority, dueDate });
	});

	return {
		methods,
		projects,
		handleSubmit,
	};
};
