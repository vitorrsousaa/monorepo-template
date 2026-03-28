import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

export function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: Number.POSITIVE_INFINITY,
				gcTime: Number.POSITIVE_INFINITY,
			},
		},
	});
}

export function createQueryWrapper(queryClient?: QueryClient) {
	const qc = queryClient ?? createTestQueryClient();
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={qc}>{children}</QueryClientProvider>
	);
}
