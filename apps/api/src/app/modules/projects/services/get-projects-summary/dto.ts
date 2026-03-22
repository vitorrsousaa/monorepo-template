import type { GetProjectsSummaryResponse } from "@repo/contracts/projects/summary";

export type GetProjectsSummaryInputService = {
	userId: string;
};

export type GetProjectsSummaryOutputService = GetProjectsSummaryResponse;
