import { httpClient } from "@/services/http-client";
import type { GetAccountInfoResponse } from "@repo/contracts/auth/account";

export async function getAccountInfo(): Promise<GetAccountInfoResponse> {
	const { data } = await httpClient.get<GetAccountInfoResponse>("/auth/account-info");
	return data;
}
