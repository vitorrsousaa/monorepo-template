import type { SigninInput, SigninResponse } from "@repo/contracts/auth/signin";
import { httpClient } from "@/services/http-client";

export async function signin(input: SigninInput): Promise<SigninResponse> {
	const { data } = await httpClient.post<SigninResponse>("/auth/signin", input);
	return data;
}
