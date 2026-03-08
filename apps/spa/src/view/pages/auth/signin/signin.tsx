import { SigninForm } from "@/modules/auth/forms/signin";
import { AuthLayout } from "@/layouts/auth-layout";
import { Icon } from "@repo/ui/icon";
import { ArrowRight, Sparkles } from "lucide-react";
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
		<AuthLayout>
			<div className="mx-auto w-full max-w-[420px] px-6">
				{/* Glass card */}
				<div
					className="animate-in fade-in slide-in-from-bottom-4 duration-700 rounded-2xl border border-white/[0.08] p-8 shadow-2xl backdrop-blur-xl sm:p-10"
					style={{
						background:
							"linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
						boxShadow:
							"0 0 0 1px rgba(255,255,255,0.03) inset, 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 80px -20px hsl(262 83% 58% / 0.1)",
					}}
				>
					{/* Header */}
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 mb-8 text-center">
						<div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
							<Sparkles className="h-5 w-5 text-purple-400" />
						</div>
						<h1
							className="mb-2 text-2xl font-semibold tracking-tight text-white"
							style={{ fontFamily: "'DM Sans', sans-serif" }}
						>
							Welcome back
						</h1>
						<p className="text-sm leading-relaxed text-white/50">
							Sign in to access your dashboard, settings and
							projects.
						</p>
					</div>

					{/* Google button */}
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
						<button
							type="button"
							onClick={handleSignInWithGoogle}
							className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/80 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
						>
							<Icon name="google" className="h-4 w-4" />
							Continue with Google
						</button>
					</div>

					{/* Divider */}
					<div className="animate-in fade-in duration-500 delay-300 my-7 flex items-center gap-3">
						<div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
						<span className="text-xs font-medium uppercase tracking-widest text-white/25">
							or
						</span>
						<div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
					</div>

					{/* Form */}
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-[400ms]">
						<SigninForm
							onSubmit={handleSubmit}
							formId={SIGNIN_FORM_ID}
						/>
					</div>

					{/* Submit */}
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500 mt-6">
						<button
							type="submit"
							form={SIGNIN_FORM_ID}
							disabled={isSubmitting}
							className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition-all duration-200 hover:bg-purple-500 hover:shadow-purple-500/30 disabled:opacity-50 disabled:pointer-events-none"
						>
							<span className="relative z-10">Sign in</span>
							<ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
							<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
						</button>
					</div>

					{/* Footer link */}
					<div className="animate-in fade-in duration-500 delay-[600ms] mt-7 text-center">
						<p className="text-sm text-white/40">
							Don&apos;t have an account?{" "}
							<button
								type="button"
								onClick={handleNavigateToSignup}
								className="font-medium text-purple-400 transition-colors duration-200 hover:text-purple-300"
							>
								Create account
							</button>
						</p>
					</div>
				</div>

				{/* Bottom subtle text */}
				<p className="animate-in fade-in duration-700 delay-700 mt-6 text-center text-xs text-white/20">
					Protected by enterprise-grade security
				</p>
			</div>
		</AuthLayout>
	);
}
