import { QUERY_KEYS } from "@/config/query-keys";
import { queryClient } from "@/libs/query";
import { removeMember as removeMemberService } from "@/modules/sharing/app/services/remove-member";
import { useMutation } from "@tanstack/react-query";

interface RemoveMemberVariables {
	projectId: string;
	memberUserId: string;
}

export function useRemoveMember() {
	const { mutate, mutateAsync, isPending, isError } = useMutation({
		mutationFn: (variables: RemoveMemberVariables) =>
			removeMemberService(variables),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.SHARING.MEMBERS(variables.projectId),
			});
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.SHARING.INVITATIONS(variables.projectId),
			});
		},
	});

	return {
		removeMember: mutate,
		removeMemberAsync: mutateAsync,
		isRemoveMemberPending: isPending,
		isRemoveMemberError: isError,
	};
}
