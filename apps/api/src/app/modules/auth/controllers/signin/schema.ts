import type z from "zod";
import { SigninInputDTO } from "@application/modules/auth/services/signin";

export const signinSchema = SigninInputDTO;

export type SigninSchema = z.infer<typeof signinSchema>;
