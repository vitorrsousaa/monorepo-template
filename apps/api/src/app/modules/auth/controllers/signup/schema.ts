import type z from "zod";
import { SignupInputDTO } from "@application/modules/auth/services/signup";

export const signupSchema = SignupInputDTO;

export type SignupSchema = z.infer<
	typeof signupSchema
>;
