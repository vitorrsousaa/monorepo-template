import { httpClient } from "@/services/http-client";
import type { CancelInvitationResponse } from "@repo/contracts/sharing/cancel-invitation";

export interface CancelInvitationInput {
	projectId: string;
	invitationId: string;
}

export async function cancelInvitation(
	input: CancelInvitationInput,
): Promise<CancelInvitationResponse> {
	const { data } = await httpClient.delete<CancelInvitationResponse>(
		`/projects/${input.projectId}/sharing/invitations/${input.invitationId}`,
	);
	return data;
}
