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
		console.log(data);
	});

	return {
		methods,
		projects,
		handleSubmit,
	};
};
