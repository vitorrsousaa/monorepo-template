import type { TSignupFormSchema } from "@/modules/auth/forms/signup";
import { SignupForm } from "@/modules/auth/forms/signup";

export function Signup() {
	const handleSubmit = async (data: TSignupFormSchema) => {
		console.log(data);
		// TODO: Implement signup logic
	};

	return (
		<SignupForm onSubmit={handleSubmit} />
	);
}
