import type { SignupInput, SignupResponse } from "@repo/contracts/auth/signup";
import { httpClient } from "@/services/http-client";

export async function signup(input: SignupInput): Promise<SignupResponse> {
	const { data } = await httpClient.post<SignupResponse>("/auth/signup", input);
	return data;
}
