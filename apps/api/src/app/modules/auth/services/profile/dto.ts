import type { User } from "@repo/contracts/auth/entities";
import { z } from "zod";

export const ProfileInputDTO = z.object({
	userId: z.string().uuid("Invalid userId"),
});

export type ProfileInput = z.infer<typeof ProfileInputDTO>;

export interface ProfileOutput {
	user: User;
}
