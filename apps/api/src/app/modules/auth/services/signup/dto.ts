import { z } from "zod";

export const SignupInputDTO = z.object({
	firstName: z.string().min(1, "firstName is required"),
	lastName: z.string().min(1, "lastName is required"),
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupInput = z.infer<
	typeof SignupInputDTO
>;

export interface SignupOutput {
	userId: string
}
