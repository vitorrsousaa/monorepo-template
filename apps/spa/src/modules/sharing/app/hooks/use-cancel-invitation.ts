import { QUERY_KEYS } from "@/config/query-keys";
import { queryClient } from "@/libs/query";
import { cancelInvitation as cancelInvitationService } from "@/modules/sharing/app/services/cancel-invitation";
import { useMutation } from "@tanstack/react-query";

interface CancelInvitationVariables {
	projectId: string;
	invitationId: string;
}

export function useCancelInvitation() {
	const { mutate, mutateAsync, isPending, isError } = useMutation({
		mutationFn: (variables: CancelInvitationVariables) =>
			cancelInvitationService(variables),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.SHARING.INVITATIONS(variables.projectId),
			});
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.SHARING.MEMBERS(variables.projectId),
			});
		},
	});

	return {
		cancelInvitation: mutate,
		cancelInvitationAsync: mutateAsync,
		isCancelInvitationPending: isPending,
		isCancelInvitationError: isError,
	};
}
