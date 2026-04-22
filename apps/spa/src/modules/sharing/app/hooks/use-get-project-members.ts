import { QUERY_KEYS } from "@/config/query-keys";
import { getProjectMembers } from "@/modules/sharing/app/services/get-project-members";
import type { GetProjectMembersResponse } from "@repo/contracts/sharing/get-project-members";
import { useQuery } from "@tanstack/react-query";

interface UseGetProjectMembersParams {
	projectId: string;
	enabled?: boolean;
}

export function useGetProjectMembers(params: UseGetProjectMembersParams) {
	const { projectId, enabled = true } = params;

	const { data, isError, isPending, isFetching, refetch } = useQuery({
		queryKey: QUERY_KEYS.SHARING.MEMBERS(projectId),
		queryFn: () => getProjectMembers({ projectId }),
		enabled: enabled && !!projectId,
	});

	const res = data as GetProjectMembersResponse | undefined;

	return {
		members: res?.members ?? [],
		isErrorProjectMembers: isError,
		isPendingProjectMembers: isPending,
		isFetchingProjectMembers: isFetching,
		refetchProjectMembers: refetch,
	};
}
