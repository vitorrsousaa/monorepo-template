import type z from "zod";
import { SignupInputDTO } from "../services/signup/dto";

export const signupSchema = SignupInputDTO;

export type SignupSchema = z.infer<
	typeof signupSchema
>;
