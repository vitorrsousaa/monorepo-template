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
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useSigninFormHook } from "./signin-form.hook";
import type { TSigninFormSchema } from "./signin-form.schema";

export interface SigninFormProps {
	formId?: string;
	isSubmitting?: boolean;
	onSubmit: (data: TSigninFormSchema) => Promise<void>;
}

export function SigninForm(props: SigninFormProps) {
	const { formId, isSubmitting = false } = props;
	const [showPassword, setShowPassword] = useState(false);

	const { handleSubmit, methods } = useSigninFormHook(props);

	return (
		<Form {...methods}>
			<form
				onSubmit={handleSubmit}
				id={formId || "signin-form"}
				className="flex flex-col gap-3.5"
			>
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
									className="bg-background"
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
							<div className="flex items-center justify-between">
								<FormLabel className="text-xs font-medium text-foreground">
									Password
								</FormLabel>
								<a
									href="#"
									className="text-xs font-medium text-primary no-underline hover:underline"
								>
									Forgot password?
								</a>
							</div>
							<FormControl>
								<div className="relative">
									<Input
										placeholder="Enter your password"
										type={showPassword ? "text" : "password"}
										autoComplete="current-password"
										disabled={isSubmitting}
										className="pe-10 bg-background"
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
									/>
								</FormControl>
								<FormLabel className="!mt-0 cursor-pointer text-xs text-muted-foreground">
									Remember me for 30 days
								</FormLabel>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					disabled={isSubmitting}
					className="mb-4.5 w-full"
					size="lg"
					loading={isSubmitting}
				>
					Sign in
					<ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
				</Button>
			</form>
		</Form>
	);
}
