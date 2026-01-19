import { SigninForm } from "@/modules/auth/forms/signin";
import { Button } from "@repo/ui/button";
import { Icon } from "@repo/ui/icon";
import { Separator } from "@repo/ui/separator";
import { ArrowRight } from "lucide-react";
import { useSigninPageHook } from "./signin.hook";

const SIGNIN_FORM_ID = "signin-form";

export function Signin() {
	const {
		handleSubmit,
		handleNavigateToSignup,
		handleSignInWithGoogle,
		isSubmitting,
	} = useSigninPageHook();

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="mx-auto w-full max-w-xs space-y-6">
				<div className="space-y-2 text-center">
					<Icon name="bell" className="mx-auto h-16 w-16" />
					<h1 className="text-3xl font-semibold">Welcome back</h1>
					<p className="text-muted-foreground">
						Sign in to access to your dashboard, settings and projects.
					</p>
				</div>
				<div className="space-y-5">
					<Button
						variant="outline"
						className="w-full justify-center gap-2"
						type="button"
						onClick={handleSignInWithGoogle}
					>
						<Icon name="google" className="h-4 w-4" />
						Sign in with Google
					</Button>

					<div className="flex items-center gap-2">
						<Separator className="flex-1" />
						<span className="text-sm text-muted-foreground">
							or sign in with email
						</span>
						<Separator className="flex-1" />
					</div>

					<SigninForm onSubmit={handleSubmit} formId={SIGNIN_FORM_ID} />
					<Button
						type="submit"
						form={SIGNIN_FORM_ID}
						disabled={isSubmitting}
						className="w-full"
					>
						Sign in
						<ArrowRight className="h-4 w-4" />
					</Button>
					<div className="text-center text-sm">
						No account?{" "}
						<button
							type="button"
							onClick={handleNavigateToSignup}
							className="text-primary font-medium hover:underline"
						>
							Create an account
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
