import type { GetProjectDetailResponse } from "@repo/contracts/projects/get-detail";

export type GetProjectDetailInputService = {
	userId: string;
	projectId: string;
};

export interface GetProjectDetailOutputService {
	data: GetProjectDetailResponse;
}
