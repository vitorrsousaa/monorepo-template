export type WithOptimisticState<T> = T & {
	optimisticState: "synced" | "error" | "pending";
};
