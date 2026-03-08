import type { TSignupFormSchema } from "@/modules/auth/forms/signup";
import { SignupForm } from "@/modules/auth/forms/signup";
import { AuthLayout } from "@/layouts/auth-layout";

export function Signup() {
	const handleSubmit = async (data: TSignupFormSchema) => {
		console.log(data);
		// TODO: Implement signup logic
	};

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
					<SignupForm onSubmit={handleSubmit} />
				</div>

				{/* Bottom subtle text */}
				<p className="animate-in fade-in duration-700 delay-700 mt-6 text-center text-xs text-white/20">
					Protected by enterprise-grade security
				</p>
			</div>
		</AuthLayout>
	);
}
