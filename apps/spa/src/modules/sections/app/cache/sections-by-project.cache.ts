import { QUERY_KEYS } from "@/config/query-keys";
import type { GetAllSectionsResponse } from "@repo/contracts/sections/get-all";
import type { Section } from "@repo/contracts/sections/entities";
import type { QueryClient } from "@tanstack/react-query";

export function sectionsByProjectCache(
	queryClient: QueryClient,
	projectId: string,
) {
	const queryKey = QUERY_KEYS.SECTIONS.BY_PROJECT(projectId);

	return {
		get(): GetAllSectionsResponse | undefined {
			return queryClient.getQueryData<GetAllSectionsResponse>(queryKey);
		},

		set(sections: Section[]) {
			queryClient.setQueryData<GetAllSectionsResponse>(queryKey, {
				sections,
				total: sections.length,
			});
		},
	};
}
