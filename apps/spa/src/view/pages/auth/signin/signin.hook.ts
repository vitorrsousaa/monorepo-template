import { ROUTES } from "@/config/routes";
import { AppError } from "@/errors/app-error";
import { useAuth } from "@/hooks/auth";
import { useSignin } from "@/modules/auth/app/hooks/use-signin";
import type { TSigninFormSchema } from "@/modules/auth/view/forms/signin";
import { toast } from "@repo/ui/sonner";
import { useNavigate } from "react-router-dom";

export function useSigninPageHook() {
	const navigate = useNavigate();

	const { signInWithGoogle, signin } = useAuth();

	const { signinAsync, isSigninPending } = useSignin();

	const handleSubmit = async (data: TSigninFormSchema) => {
		try {
			const { accessToken } = await signinAsync(data);
			signin(accessToken);
			redirectToDashboard();

			toast.success("Signed in successfully");
		} catch (error) {
			if (error instanceof AppError) {
				toast.error(error.message);
			} else {
				toast.error("Failed to signin");
			}
		}
	};

	const handleNavigateToSignup = () => {
		navigate(ROUTES.SIGNUP);
	};

	const handleSignInWithGoogle = () => {
		signInWithGoogle();
		signin("accessToken"); // TODO: Implement accessToken generation
	};

	const redirectToDashboard = () => {
		navigate(ROUTES.TASKS.DASHBOARD);
	};

	return {
		isSubmitting: isSigninPending,
		handleSubmit,
		handleNavigateToSignup,
		handleSignInWithGoogle,
		signInWithGoogle,
	};
}
