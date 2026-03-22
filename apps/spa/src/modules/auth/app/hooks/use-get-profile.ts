import { QUERY_KEYS } from "@/config/query-keys";
import { getProfile } from "@/modules/auth/app/services/profile";
import type { ProfileResponse } from "@repo/contracts/auth/profile";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export type UseGetProfileParams = Omit<
	UseQueryOptions<ProfileResponse>,
	"queryKey" | "queryFn"
>;

export function useGetProfile(params: UseGetProfileParams) {
	const { data, isError, isFetching, isSuccess, refetch } = useQuery({
		queryKey: QUERY_KEYS.AUTH.PROFILE,
		queryFn: getProfile,
		...params,
	});

	return {
		user: data?.user ?? null,
		isProfileError: isError,
		isProfileFetching: isFetching,
		isProfileSuccess: isSuccess,
		refetchProfile: refetch,
	};
}
