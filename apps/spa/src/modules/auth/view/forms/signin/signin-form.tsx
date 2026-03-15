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
import { useState } from "react";
import { useSigninFormHook } from "./signin-form.hook";
import type { TSigninFormSchema } from "./signin-form.schema";

export interface SigninFormProps {
	formId?: string;
	isSubmitting?: boolean;
	onSubmit: (data: TSigninFormSchema) => Promise<void>;
}

export function SigninForm(props: SigninFormProps) {
	const { formId, isSubmitting } = props;
	const [isVisible, setIsVisible] = useState<boolean>(false);

	const { handleSubmit, methods } = useSigninFormHook(props);

	const toggleVisibility = () => setIsVisible((prevState) => !prevState);

	const inputClasses =
		"w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 transition-all duration-200 outline-none focus:border-purple-500/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50";

	const inputWithIconClasses = `${inputClasses} ps-10`;

	return (
		<Form {...methods}>
			<form
				onSubmit={handleSubmit}
				id={formId || "signin-form"}
				className="space-y-5"
			>
				<FormField
					control={methods.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-xs font-medium uppercase tracking-wider text-white/40">
								Email
							</FormLabel>
							<FormControl>
								<div className="relative mt-1.5">
									<input
										className={inputWithIconClasses}
										placeholder="you@company.com"
										type="email"
										required
										disabled={isSubmitting}
										{...field}
									/>
									<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
										<Icon name="mail" className="h-4 w-4 text-white/20" />
									</div>
								</div>
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
							<div className="flex items-center justify-between">
								<FormLabel className="text-xs font-medium uppercase tracking-wider text-white/40">
									Password
								</FormLabel>
								<a
									href="#"
									className="text-xs text-purple-400/70 transition-colors duration-200 hover:text-purple-300"
								>
									Forgot?
								</a>
							</div>
							<FormControl>
								<div className="relative mt-1.5">
									<input
										className={`${inputWithIconClasses} pe-10`}
										placeholder="Enter your password"
										type={isVisible ? "text" : "password"}
										required
										disabled={isSubmitting}
										{...field}
									/>
									<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
										<Icon name="lockClosed" className="h-4 w-4 text-white/20" />
									</div>
									<button
										className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-white/20 transition-colors duration-200 hover:text-white/50"
										type="button"
										onClick={toggleVisibility}
										aria-label={isVisible ? "Hide password" : "Show password"}
										aria-pressed={isVisible}
										disabled={isSubmitting}
									>
										{isVisible ? (
											<Icon name="eyeOff" className="h-4 w-4" />
										) : (
											<Icon name="eye" className="h-4 w-4" />
										)}
									</button>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={methods.control}
					name="rememberMe"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center gap-2.5 pt-1">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isSubmitting}
										className="border-white/[0.15] data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-600"
									/>
								</FormControl>
								<FormLabel className="!mt-0 cursor-pointer text-sm text-white/40 transition-colors duration-200 hover:text-white/60">
									Remember for 30 days
								</FormLabel>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
