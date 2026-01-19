import * as z from "zod";

export const SignupFormSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(8, "Password must be at least 8 characters long"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type TSignupFormSchema = z.infer<typeof SignupFormSchema>;

export const defaultInitialValues: TSignupFormSchema = {
	name: "",
	email: "",
	password: "",
	confirmPassword: "",
};
