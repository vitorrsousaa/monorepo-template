import { ROUTES } from "@/config/routes";
import { Button } from "@repo/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/form";
import { Icon } from "@repo/ui/icon";
import { Input } from "@repo/ui/input";
import { Separator } from "@repo/ui/separator";
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

	const { handleSubmit, methods } = useSignupFormHook(props);

	const handleNavigateToSignin = () => {
		navigate(ROUTES.SIGNIN);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-center gap-1 text-center">
				<h1 className="text-2xl font-bold">Create your account</h1>
				<p className="text-muted-foreground text-sm text-balance">
					Fill in the form below to create your account
				</p>
			</div>

			<Form {...methods}>
				<form
					onSubmit={handleSubmit}
					id={formId || "signup-form"}
					className="space-y-6"
				>
					<FormField
						control={methods.control}
						name="name"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Full Name</FormLabel>
								<FormControl>
									<Input
										placeholder="John Doe"
										type="text"
										required
										disabled={isSubmitting}
										{...field}
										className="w-full"
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
							<FormItem className="w-full">
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="m@example.com"
										type="email"
										required
										disabled={isSubmitting}
										{...field}
										className="w-full"
									/>
								</FormControl>
								<FormDescription>
									We&apos;ll use this to contact you. We will not share your
									email with anyone else.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name="password"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										required
										disabled={isSubmitting}
										{...field}
										className="w-full"
									/>
								</FormControl>
								<FormDescription>
									Must be at least 8 characters long.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={methods.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										required
										disabled={isSubmitting}
										{...field}
										className="w-full"
									/>
								</FormControl>
								<FormDescription>Please confirm your password.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isSubmitting} className="w-full">
						Create Account
					</Button>
				</form>
			</Form>

			<div className="flex items-center gap-2">
				<Separator className="flex-1" />
				<span className="text-sm text-muted-foreground">Or continue with</span>
				<Separator className="flex-1" />
			</div>

			<Button variant="outline" type="button" className="w-full">
				<Icon name="google" className="h-4 w-4" />
				Sign up with Google
			</Button>

			<p className="text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<button
					type="button"
					onClick={handleNavigateToSignin}
					className="text-primary font-medium hover:underline"
				>
					Sign in
				</button>
			</p>
		</div>
	);
}
