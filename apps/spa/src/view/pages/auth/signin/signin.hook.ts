import { ROUTES } from "@/config/routes";
import { useAuth } from "@/hooks/auth";
import type { TSigninFormSchema } from "@/modules/auth/forms/signin";
import { useNavigate } from "react-router-dom";

export function useSigninPageHook() {
	const isSubmitting = false;

	const navigate = useNavigate();

	const { signInWithGoogle, signin } = useAuth();

	const handleSubmit = async (data: TSigninFormSchema) => {
		// TODO: Implement signin logic
		console.log("Signin data:", data);

		redirectToDashboard();
	};

	const handleNavigateToSignup = () => {
		navigate(ROUTES.SIGNUP);
	};

	const handleSignInWithGoogle = () => {
		// TODO: Implement signin with Google logic
		signInWithGoogle();
		signin("accessToken"); // TODO: Implement accessToken generation
	};

	const redirectToDashboard = () => {
		navigate(ROUTES.TODO.DASHBOARD);
	};

	return {
		isSubmitting,
		handleSubmit,
		handleNavigateToSignup,
		handleSignInWithGoogle,
		signInWithGoogle,
	};
}
