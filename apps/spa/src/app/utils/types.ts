export const OptimisticState = {
	SYNCED: "synced",
	ERROR: "error",
	PENDING: "pending",
} as const;

export type OptimisticState =
	(typeof OptimisticState)[keyof typeof OptimisticState];

export type WithOptimisticState<T> = T & {
	optimisticState: OptimisticState;
};
