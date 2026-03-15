import { ROUTES } from "@/config/routes";
import { AppError } from "@/errors/app-error";
import { useAuth } from "@/hooks/auth";
import { useSignin } from "@/modules/auth/app/hooks/use-signin";
import { useSignup } from "@/modules/auth/app/hooks/use-signup";
import type { TSignupFormSchema } from "@/modules/auth/view/forms/signup";
import { SignupForm } from "@/modules/auth/view/forms/signup";
import { Button } from "@repo/ui/button";
import { Icon } from "@repo/ui/icon";
import { toast } from "@repo/ui/sonner";
import { useNavigate } from "react-router-dom";

export function Signup() {
	const navigate = useNavigate();

	const { signupAsync, isSignupPending } = useSignup();

	const redirectToDashboard = () => {
		navigate(ROUTES.TODO.DASHBOARD);
	};

	const { signin } = useAuth();

	const { signinAsync, isSigninPending } = useSignin();

	const handleNavigateToSignin = () => {
		navigate(ROUTES.SIGNIN);
	};

	const handleSubmit = async (data: TSignupFormSchema) => {
		try {
			await signupAsync(data);

			const { accessToken } = await signinAsync({
				email: data.email,
				password: data.password,
			});
			signin(accessToken);
			redirectToDashboard();
			toast.success("Signed up successfully");
		} catch (error) {
			if (error instanceof AppError) {
				toast.error(error.message);
			} else {
				toast.error("Failed to signup");
			}
		}
	};

	const isSubmitting = isSignupPending || isSigninPending;

	return (
		<div className="w-full max-w-[380px]">
			<div className="form-header mb-7">
				<h1 className="form-headline mb-1.5 text-[22px] font-semibold leading-tight tracking-tight text-foreground">
					Create your account
				</h1>
			</div>

			<Button
				type="button"
				variant="outline"
				className="mb-5 w-full "
				disabled={isSubmitting}
			>
				<Icon name="google" className="h-4 w-4" />
				Continue with Google
			</Button>

			<div className="divider mb-5 flex items-center gap-3">
				<div className="h-px flex-1 bg-border" />
				<span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
					or
				</span>
				<div className="h-px flex-1 bg-border" />
			</div>

			<SignupForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

			<p className="signin-row text-center text-[13px] text-muted-foreground">
				Already have an account?{" "}
				<Button
					type="button"
					variant="link"
					onClick={handleNavigateToSignin}
					disabled={isSubmitting}
					className="h-auto p-0 font-medium text-primary no-underline hover:underline"
				>
					Sign in
				</Button>
			</p>
		</div>
	);
}
