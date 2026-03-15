import { signup as signupService } from "@/modules/auth/app/services/signup";
import { useMutation } from "@tanstack/react-query";

export function useSignup() {
	const { mutate, mutateAsync, isPending, isError } = useMutation({
		mutationFn: signupService,
	});

	return {
		isSignupPending: isPending,
		isSignupError: isError,
		signup: mutate,
		signupAsync: mutateAsync,
	};
}
