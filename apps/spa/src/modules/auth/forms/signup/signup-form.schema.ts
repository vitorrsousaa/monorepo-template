import * as z from "zod";

export const SignupFormSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.string().email("Invalid email address"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters long")
			.refine((s) => /[a-z]/.test(s), "Password must contain at least one lowercase letter")
			.refine((s) => /[A-Z]/.test(s), "Password must contain at least one uppercase letter")
			.refine((s) => /\d/.test(s), "Password must contain at least one number"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
		agreeToTerms: z.boolean().refine((value) => value, {
			message: "You must agree to the Terms and Privacy Policy",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type TSignupFormSchema = z.infer<typeof SignupFormSchema>;

export const defaultInitialValues: TSignupFormSchema = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: "",
	agreeToTerms: false,
};
