import { z } from "zod";

export const SigninInputDTO = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SigninInput = z.infer<typeof SigninInputDTO>;

export interface SigninOutput {
	accessToken: string;
	refreshToken: string;
	idToken: string;
}
