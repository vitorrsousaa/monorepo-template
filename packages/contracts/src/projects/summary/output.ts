export interface ProjectSummary {
	id: string;
	name: string;
	description?: string | null;
	color: string;
	completedCount: number;
	totalCount: number;
	createdAt: string;
	updatedAt: string;
	percentageCompleted: number;
}

export interface GetProjectsSummaryResponse {
	projects: ProjectSummary[];
}
