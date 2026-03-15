import { signin as signinService } from "@/modules/auth/app/services/signin";
import { useMutation } from "@tanstack/react-query";

export function useSignin() {
	const { mutate, mutateAsync, isPending, isError } = useMutation({
		mutationFn: signinService,
	});

	return {
		isSigninPending: isPending,
		isSigninError: isError,
		signin: mutate,
		signinAsync: mutateAsync,
	};
}
