import * as z from "zod";

export const SigninFormSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
	rememberMe: z.boolean().optional().default(false),
});

export type TSigninFormSchema = z.infer<typeof SigninFormSchema>;

export const defaultInitialValues: TSigninFormSchema = {
	email: "",
	password: "",
	rememberMe: false,
};
