import type { User } from "@repo/contracts/auth/entities";
import { z } from "zod";

export const GetAccountInfoInputDTO = z.object({
	userId: z.string().uuid("Invalid userId"),
});

export type GetAccountInfoInput = z.infer<typeof GetAccountInfoInputDTO>;

export interface GetAccountInfoOutput {
	user: User;
}
