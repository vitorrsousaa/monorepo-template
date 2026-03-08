import { ROUTES } from "@/config/routes";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/form";
import { Icon } from "@repo/ui/icon";
import { ArrowRight, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupFormHook } from "./signup-form.hook";
import type { TSignupFormSchema } from "./signup-form.schema";

export interface SignupFormProps {
	formId?: string;
	isSubmitting?: boolean;
	onSubmit: (data: TSignupFormSchema) => Promise<void>;
}

export function SignupForm(props: SignupFormProps) {
	const { formId, isSubmitting } = props;
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const { handleSubmit, methods } = useSignupFormHook(props);

	const handleNavigateToSignin = () => {
		navigate(ROUTES.SIGNIN);
	};

	const inputClasses =
		"w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 transition-all duration-200 outline-none focus:border-purple-500/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50";

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 text-center">
				<div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
					<UserPlus className="h-5 w-5 text-purple-400" />
				</div>
				<h1
					className="mb-2 text-2xl font-semibold tracking-tight text-white"
					style={{ fontFamily: "'DM Sans', sans-serif" }}
				>
					Create your account
				</h1>
				<p className="text-sm leading-relaxed text-white/50">
					Get started with your free account today
				</p>
			</div>

			{/* Google button */}
			<div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
				<button
					type="button"
					className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/80 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
				>
					<Icon name="google" className="h-4 w-4" />
					Continue with Google
				</button>
			</div>

			{/* Divider */}
			<div className="animate-in fade-in duration-500 delay-300 flex items-center gap-3">
				<div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
				<span className="text-xs font-medium uppercase tracking-widest text-white/25">
					or
				</span>
				<div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
			</div>

			{/* Form */}
			<div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-[400ms]">
				<Form {...methods}>
					<form
						onSubmit={handleSubmit}
						id={formId || "signup-form"}
						className="space-y-5"
					>
						<FormField
							control={methods.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xs font-medium uppercase tracking-wider text-white/40">
										Full Name
									</FormLabel>
									<FormControl>
										<input
											className={`${inputClasses} mt-1.5`}
											placeholder="John Doe"
											type="text"
											required
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={methods.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xs font-medium uppercase tracking-wider text-white/40">
										Email
									</FormLabel>
									<FormControl>
										<input
											className={`${inputClasses} mt-1.5`}
											placeholder="you@company.com"
											type="email"
											required
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={methods.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xs font-medium uppercase tracking-wider text-white/40">
										Password
									</FormLabel>
									<FormControl>
										<div className="relative mt-1.5">
											<input
												className={`${inputClasses} pe-10`}
												placeholder="Min. 8 characters"
												type={
													showPassword
														? "text"
														: "password"
												}
												required
												disabled={isSubmitting}
												{...field}
											/>
											<button
												className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-white/20 transition-colors duration-200 hover:text-white/50"
												type="button"
												onClick={() =>
													setShowPassword(!showPassword)
												}
												aria-label={
													showPassword
														? "Hide password"
														: "Show password"
												}
												disabled={isSubmitting}
											>
												<Icon
													name={
														showPassword
															? "eyeOff"
															: "eye"
													}
													className="h-4 w-4"
												/>
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={methods.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xs font-medium uppercase tracking-wider text-white/40">
										Confirm Password
									</FormLabel>
									<FormControl>
										<div className="relative mt-1.5">
											<input
												className={`${inputClasses} pe-10`}
												placeholder="Confirm your password"
												type={
													showConfirm
														? "text"
														: "password"
												}
												required
												disabled={isSubmitting}
												{...field}
											/>
											<button
												className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-white/20 transition-colors duration-200 hover:text-white/50"
												type="button"
												onClick={() =>
													setShowConfirm(!showConfirm)
												}
												aria-label={
													showConfirm
														? "Hide password"
														: "Show password"
												}
												disabled={isSubmitting}
											>
												<Icon
													name={
														showConfirm
															? "eyeOff"
															: "eye"
													}
													className="h-4 w-4"
												/>
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Submit */}
						<div className="pt-1">
							<button
								type="submit"
								disabled={isSubmitting}
								className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition-all duration-200 hover:bg-purple-500 hover:shadow-purple-500/30 disabled:opacity-50 disabled:pointer-events-none"
							>
								<span className="relative z-10">
									Create Account
								</span>
								<ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
								<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
							</button>
						</div>
					</form>
				</Form>
			</div>

			{/* Footer */}
			<div className="animate-in fade-in duration-500 delay-500 text-center">
				<p className="text-sm text-white/40">
					Already have an account?{" "}
					<button
						type="button"
						onClick={handleNavigateToSignin}
						className="font-medium text-purple-400 transition-colors duration-200 hover:text-purple-300"
					>
						Sign in
					</button>
				</p>
			</div>
		</div>
	);
}
