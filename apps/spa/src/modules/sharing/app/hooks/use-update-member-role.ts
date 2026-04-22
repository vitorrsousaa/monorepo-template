import { QUERY_KEYS } from "@/config/query-keys";
import { queryClient } from "@/libs/query";
import { updateMemberRole as updateMemberRoleService } from "@/modules/sharing/app/services/update-member-role";
import type { UpdateMemberRoleInput } from "@repo/contracts/sharing/update-member-role";
import { useMutation } from "@tanstack/react-query";

interface UpdateMemberRoleVariables {
	projectId: string;
	memberUserId: string;
	body: UpdateMemberRoleInput;
}

export function useUpdateMemberRole() {
	const { mutate, mutateAsync, isPending, isError } = useMutation({
		mutationFn: (variables: UpdateMemberRoleVariables) =>
			updateMemberRoleService(variables),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.SHARING.MEMBERS(variables.projectId),
			});
		},
	});

	return {
		updateMemberRole: mutate,
		updateMemberRoleAsync: mutateAsync,
		isUpdateMemberRolePending: isPending,
		isUpdateMemberRoleError: isError,
	};
}
