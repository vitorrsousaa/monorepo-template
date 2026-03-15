import { SigninForm } from "@/modules/auth/view/forms/signin";
import { Button } from "@repo/ui/button";
import { Icon } from "@repo/ui/icon";
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
		<div className="w-full max-w-[380px]">
			<div className="form-header mb-7">
				<h1 className="form-headline mb-1.5 text-[22px] font-semibold leading-tight tracking-tight text-foreground">
					Welcome back
				</h1>
				<p className="form-sub text-[13px] leading-normal text-muted-foreground">
					Sign in to pick up where you left off.
				</p>
			</div>

			<Button
				type="button"
				variant="outline"
				className="mb-5 w-full"
				onClick={handleSignInWithGoogle}
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

			<SigninForm
				formId={SIGNIN_FORM_ID}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
			/>

			<p className="signup-row mt-4.5 text-center text-[13px] text-muted-foreground">
				Don&apos;t have an account?{" "}
				<Button
					type="button"
					variant="link"
					onClick={handleNavigateToSignup}
					disabled={isSubmitting}
					className="h-auto p-0 font-medium text-primary no-underline hover:underline"
				>
					Create account
				</Button>
			</p>
		</div>
	);
}
