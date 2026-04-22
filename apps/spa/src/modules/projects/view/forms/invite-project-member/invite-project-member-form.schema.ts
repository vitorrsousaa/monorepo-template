import type { InviteToProjectInput } from "@repo/contracts/sharing/invite-to-project";

export { inviteToProjectSchema } from "@repo/contracts/sharing/invite-to-project";

export type InviteProjectMemberFormValues = InviteToProjectInput;

export const defaultInitialValues: InviteProjectMemberFormValues = {
	email: "",
	role: "editor",
};
