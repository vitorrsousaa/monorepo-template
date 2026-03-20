import type { QueryClient, QueryKey } from "@tanstack/react-query";

export function generateTempId(): string {
	return crypto.randomUUID();
}

export function snapshotQueryData<T>(
	queryClient: QueryClient,
	queryKey: QueryKey,
): T | undefined {
	return queryClient.getQueryData<T>(queryKey);
}

export async function cancelRelatedQueries(
	queryClient: QueryClient,
	queryKeys: QueryKey[],
): Promise<void> {
	await Promise.all(
		queryKeys.map((queryKey) => queryClient.cancelQueries({ queryKey })),
	);
}

export function restoreSnapshot<T>(
	queryClient: QueryClient,
	queryKey: QueryKey,
	snapshot: T | undefined,
): void {
	if (snapshot === undefined) {
		queryClient.removeQueries({ queryKey });
		return;
	}
	queryClient.setQueryData<T>(queryKey, snapshot);
}
