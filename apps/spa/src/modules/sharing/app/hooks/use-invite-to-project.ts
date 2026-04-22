import { QUERY_KEYS } from "@/config/query-keys";
import { queryClient } from "@/libs/query";
import { inviteToProject as inviteToProjectService } from "@/modules/sharing/app/services/invite-to-project";
import type { InviteToProjectInput } from "@repo/contracts/sharing/invite-to-project";
import { useMutation } from "@tanstack/react-query";

interface InviteToProjectVariables {
	projectId: string;
	body: InviteToProjectInput;
}

export function useInviteToProject() {
	const { mutate, mutateAsync, isPending, isError } = useMutation({
		mutationFn: (variables: InviteToProjectVariables) =>
			inviteToProjectService(variables),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.SHARING.INVITATIONS(variables.projectId),
			});
		},
	});

	return {
		inviteToProject: mutate,
		inviteToProjectAsync: mutateAsync,
		isInviteToProjectPending: isPending,
		isInviteToProjectError: isError,
	};
}
