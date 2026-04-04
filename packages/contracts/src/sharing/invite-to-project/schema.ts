import { z } from "zod";

export const inviteToProjectSchema = z.object({
	email: z.string().email(),
	role: z.enum(["editor", "viewer"]),
});

export type InviteToProjectInput = z.infer<typeof inviteToProjectSchema>;
