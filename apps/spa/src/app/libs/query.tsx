import type { ReactNode } from "react";

import {
	QueryClient,
	QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Number.POSITIVE_INFINITY, // Data never goes stale - manual refetch only
			gcTime: 1000 * 60 * 60, // 1 hour - Keep unused data in cache
			retry: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false, // CRITICAL: Don't refetch when component mounts
			refetchOnReconnect: false,
		},
	},
});

export function QueryClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<TanstackQueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</TanstackQueryClientProvider>
	);
}
