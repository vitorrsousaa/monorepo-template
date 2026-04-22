import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { InviteProjectMemberFormProps } from "./invite-project-member-form";
import {
	defaultInitialValues,
	inviteToProjectSchema,
} from "./invite-project-member-form.schema";

export function useInviteProjectMemberFormHook(
	props: InviteProjectMemberFormProps,
) {
	const { onSubmit } = props;

	const methods = useForm({
		resolver: zodResolver(inviteToProjectSchema),
		defaultValues: defaultInitialValues,
	});

	const { handleSubmit: hookFormSubmit } = methods;

	const handleSubmit = hookFormSubmit(async (data) => {
		await onSubmit(data);
		methods.reset(defaultInitialValues);
	});

	return { methods, handleSubmit };
}
