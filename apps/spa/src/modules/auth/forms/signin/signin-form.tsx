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

	return (
		<Form {...methods}>
			<form
				onSubmit={handleSubmit}
				id={formId || "signin-form"}
				className="space-y-6"
			>
				<FormField
					control={methods.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<div className="relative mt-2.5">
									<Input
										className="peer ps-9"
										placeholder="ephraim@blocks.so"
										type="email"
										required
										disabled={isSubmitting}
										{...field}
									/>
									<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
										<Icon name="mail" className="h-4 w-4" />
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
								<FormLabel>Password</FormLabel>
								<a href="#" className="text-sm text-primary hover:underline">
									Forgot Password?
								</a>
							</div>
							<FormControl>
								<div className="relative mt-2.5">
									<Input
										className="ps-9 pe-9"
										placeholder="Enter your password"
										type={isVisible ? "text" : "password"}
										required
										disabled={isSubmitting}
										{...field}
									/>
									<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
										<Icon name="lockClosed" className="h-4 w-4" />
									</div>
									<button
										className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
										type="button"
										onClick={toggleVisibility}
										aria-label={isVisible ? "Hide password" : "Show password"}
										aria-pressed={isVisible}
										aria-controls="password"
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
							<div className="flex items-center gap-2 pt-1">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isSubmitting}
									/>
								</FormControl>
								<FormLabel className="!mt-0 cursor-pointer">
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
