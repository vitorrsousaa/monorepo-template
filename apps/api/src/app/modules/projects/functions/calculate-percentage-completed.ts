export function calculatePercentageCompleted(
	completedCount: number,
	totalCount: number,
) {
	return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
}
