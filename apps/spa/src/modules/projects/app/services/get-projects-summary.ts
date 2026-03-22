import { httpClient } from "@/services/http-client";
import type { GetProjectsSummaryResponse } from "@repo/contracts/projects/summary";

export async function getProjectsSummary() {
	const { data } =
		await httpClient.get<GetProjectsSummaryResponse>("/projects/summary");

	return data;
}
