import type { ProfileResponse } from "@repo/contracts/auth/profile";
import { httpClient } from "@/services/http-client";

export async function getProfile(): Promise<ProfileResponse> {
	const { data } = await httpClient.get<ProfileResponse>("/auth/profile");
	return data;
}
