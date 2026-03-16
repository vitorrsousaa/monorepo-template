import { User } from "@repo/contracts/auth/user";
import { z } from "zod";

export const ProfileInputDTO = z.object({
	userId: z.string().uuid("Invalid userId"),
});

export type ProfileInput = z.infer<typeof ProfileInputDTO>;

export interface ProfileOutput {
	user: User;
}
