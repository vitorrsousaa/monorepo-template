import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SigninFormProps } from "./signin-form";
import { defaultInitialValues, SigninFormSchema } from "./signin-form.schema";

export function useSigninFormHook(props: SigninFormProps) {
	const { onSubmit } = props;

	const methods = useForm({
		resolver: zodResolver(SigninFormSchema),
		defaultValues: defaultInitialValues,
	});

	const { handleSubmit: hookFormSubmit } = methods;

	const handleSubmit = hookFormSubmit(async (data) => {
		await onSubmit(data);
	});

	return { methods, handleSubmit };
}
