import { QUERY_KEYS } from "@/config/query-keys";
import { getAccountInfo } from "@/modules/auth/app/services/account";
import type { GetAccountInfoResponse } from "@repo/contracts/auth/account";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export type UseGetAccountInfoParams = Omit<
	UseQueryOptions<GetAccountInfoResponse>,
	"queryKey" | "queryFn"
>;

export function useGetAccountInfo(params: UseGetAccountInfoParams) {
	const { data, isError, isFetching, isSuccess, refetch } = useQuery({
		queryKey: QUERY_KEYS.AUTH.ACCOUNT_INFO,
		queryFn: getAccountInfo,
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
