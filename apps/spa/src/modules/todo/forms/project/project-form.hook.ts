import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ProjectFormProps } from "./project-form";
import { defaultInitialValues, ProjectFormSchema } from "./project-form.schema";

export function useProjectFormHook(props: ProjectFormProps) {
	const { onSubmit } = props;

	const methods = useForm({
		resolver: zodResolver(ProjectFormSchema),
		defaultValues: defaultInitialValues,
	});

	const { handleSubmit: hookFormSubmit } = methods;

	const handleSubmit = hookFormSubmit(async (data) => {
		await onSubmit(data);
	});

	return { methods, handleSubmit };
}
