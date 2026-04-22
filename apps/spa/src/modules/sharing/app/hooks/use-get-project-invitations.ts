import { QUERY_KEYS } from "@/config/query-keys";
import { getProjectInvitations } from "@/modules/sharing/app/services/get-project-invitations";
import type { GetProjectInvitationsResponse } from "@repo/contracts/sharing/get-project-invitations";
import { useQuery } from "@tanstack/react-query";

interface UseGetProjectInvitationsParams {
	projectId: string;
	enabled?: boolean;
}

export function useGetProjectInvitations(
	params: UseGetProjectInvitationsParams,
) {
	const { projectId, enabled = true } = params;

	const { data, isError, isPending, isFetching, refetch } = useQuery({
		queryKey: QUERY_KEYS.SHARING.INVITATIONS(projectId),
		queryFn: () => getProjectInvitations({ projectId }),
		enabled: enabled && !!projectId,
	});

	const res = data as GetProjectInvitationsResponse | undefined;

	return {
		invitations: res?.invitations ?? [],
		isErrorProjectInvitations: isError,
		isPendingProjectInvitations: isPending,
		isFetchingProjectInvitations: isFetching,
		refetchProjectInvitations: refetch,
	};
}
