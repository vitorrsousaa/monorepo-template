import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/form";
import { Icon } from "@repo/ui/icon";
import { Input } from "@repo/ui/input";
import { cn } from "@repo/ui/utils";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useSignupFormHook } from "./signup-form.hook";
import type { TSignupFormSchema } from "./signup-form.schema";
import { getPasswordStrength } from "./use-password-strength";

export interface SignupFormProps {
	formId?: string;
	isSubmitting?: boolean;
	onSubmit: (data: TSignupFormSchema) => Promise<void>;
}

export function SignupForm(props: SignupFormProps) {
	const { formId, isSubmitting = false } = props;
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const { handleSubmit, methods } = useSignupFormHook(props);
	const passwordValue = methods.watch("password");
	const strength = getPasswordStrength(passwordValue ?? "");

	return (
		<Form {...methods}>
			<form
				onSubmit={handleSubmit}
				id={formId || "signup-form"}
				className="flex flex-col gap-3.5"
			>
				<div className="grid grid-cols-2 gap-2.5">
					<FormField
						control={methods.control}
						name="firstName"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-1.5">
								<FormLabel className="text-xs font-medium text-foreground">
									First name
								</FormLabel>
								<FormControl>
									<Input
										placeholder="John"
										type="text"
										autoComplete="given-name"
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
						name="lastName"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-1.5">
								<FormLabel className="text-xs font-medium text-foreground">
									Last name
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Doe"
										type="text"
										autoComplete="family-name"
										disabled={isSubmitting}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={methods.control}
					name="email"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1.5">
							<FormLabel className="text-xs font-medium text-foreground">
								Email
							</FormLabel>
							<FormControl>
								<Input
									placeholder="john.doe@example.com"
									type="email"
									autoComplete="email"
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
						<FormItem className="flex flex-col gap-1.5">
							<FormLabel className="text-xs font-medium text-foreground">
								Password
							</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										aria-invalid={!!methods.formState.errors.password}
										placeholder="Min. 8 characters"
										type={showPassword ? "text" : "password"}
										autoComplete="new-password"
										disabled={isSubmitting}
										{...field}
									/>
									<button
										type="button"
										className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center border-none bg-transparent p-0 text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"
										onClick={() => setShowPassword(!showPassword)}
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
										disabled={isSubmitting}
									>
										<Icon
											name={showPassword ? "eyeOff" : "eye"}
											className="h-[15px] w-[15px]"
										/>
									</button>
								</div>
							</FormControl>
							<div className="pw-strength mt-1.5 flex gap-1">
								{[0, 1, 2, 3].map((i) => (
									<div
										key={i}
										className={cn(
											"h-0.5 flex-1 rounded-sm transition-colors duration-300",
											i < strength.score
												? strength.level === "weak"
													? "bg-destructive"
													: strength.level === "fair"
														? "bg-primary/80"
														: "bg-green-600"
												: "bg-muted",
										)}
									/>
								))}
							</div>
							<span
								className={cn(
									"text-[11px]",
									strength.score >= 3
										? "text-green-600"
										: strength.score >= 2
											? "text-primary"
											: strength.score >= 1
												? "text-destructive"
												: "text-muted-foreground",
								)}
							>
								{strength.label}
							</span>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={methods.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1.5">
							<FormLabel className="text-xs font-medium text-foreground">
								Confirm password
							</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										aria-invalid={!!methods.formState.errors.confirmPassword}
										placeholder="Repeat your password"
										type={showConfirm ? "text" : "password"}
										autoComplete="new-password"
										disabled={isSubmitting}
										{...field}
									/>
									<button
										type="button"
										className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center border-none bg-transparent p-0 text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"
										onClick={() => setShowConfirm(!showConfirm)}
										aria-label={showConfirm ? "Hide password" : "Show password"}
										disabled={isSubmitting}
									>
										<Icon
											name={showConfirm ? "eyeOff" : "eye"}
											className="h-[15px] w-[15px]"
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
					name="agreeToTerms"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-0">
							<div className="terms flex items-start gap-2 pt-1">
								<FormControl>
									<Checkbox
										id="agree-to-terms"
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isSubmitting}
									/>
								</FormControl>
								<label
									htmlFor="agree-to-terms"
									className="terms-text cursor-pointer text-xs leading-relaxed text-muted-foreground"
								>
									I agree to the{" "}
									<a
										href="#"
										className="font-medium text-primary no-underline hover:underline"
									>
										Terms of Service
									</a>{" "}
									and{" "}
									<a
										href="#"
										className="font-medium text-primary no-underline hover:underline"
									>
										Privacy Policy
									</a>
								</label>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					disabled={isSubmitting}
					className="w-full "
					size="lg"
					loading={isSubmitting}
				>
					Create account
					<ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
				</Button>
			</form>
		</Form>
	);
}
