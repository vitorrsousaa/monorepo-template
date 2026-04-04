import { z } from "zod";

export const updateMemberRoleSchema = z.object({
	role: z.enum(["editor", "viewer"]),
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
