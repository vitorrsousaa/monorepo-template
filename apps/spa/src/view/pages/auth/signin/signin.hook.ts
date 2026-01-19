import { ROUTES } from "@/config/routes";
import type { TSigninFormSchema } from "@/modules/auth/forms/signin";
import { useNavigate } from "react-router-dom";

export function useSigninPageHook() {
	const isSubmitting = false;

	const navigate = useNavigate();

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
		console.log("Signin with Google");

		redirectToDashboard();
	};

	const redirectToDashboard = () => {
		navigate(ROUTES.TODO.DASHBOARD);
	};

	return {
		isSubmitting,
		handleSubmit,
		handleNavigateToSignup,
		handleSignInWithGoogle,
	};
}
