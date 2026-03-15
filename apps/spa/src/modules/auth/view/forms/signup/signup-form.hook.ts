import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SignupFormProps } from "./signup-form";
import { defaultInitialValues, SignupFormSchema } from "./signup-form.schema";

export function useSignupFormHook(props: SignupFormProps) {
	const { onSubmit } = props;

	const methods = useForm({
		resolver: zodResolver(SignupFormSchema),
		defaultValues: defaultInitialValues,
	});

	const { handleSubmit: hookFormSubmit } = methods;

	const handleSubmit = hookFormSubmit(async (data) => {
		await onSubmit(data);
	});

	return { methods, handleSubmit };
}
