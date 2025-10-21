import type { ReactNode } from "react";

import {
	QueryClient,
	QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Number.POSITIVE_INFINITY, // Always stale
			refetchInterval: 1000 * 60 * 45, // 45 minutes
			retry: false,
			refetchOnWindowFocus: false,
			gcTime: 1000 * 60 * 60 * 1, // 1 hours
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
