import type { ProjectDetailWithOptimisticState } from "@/modules/projects/app/hooks/use-get-project-detail";
import { OptimisticState } from "@/utils/types";
import type { GetProjectDetailResponse } from "@repo/contracts/projects/get-detail";
import { buildProject } from "./build-project";
import { buildSectionWithTasks } from "./build-section";

export function buildProjectDetail(
	overrides?: Partial<GetProjectDetailResponse>,
): ProjectDetailWithOptimisticState {
	const base = {
		project: {
			...buildProject(),
			completedCount: 0,
			totalCount: 0,
			percentageCompleted: 0,
		},
		sections: [buildSectionWithTasks()],
		...overrides,
	};

	return {
		...base,
		optimisticState: OptimisticState.SYNCED,
		sections: base.sections.map((s) => ({
			...s,
			optimisticState: OptimisticState.SYNCED,
			tasks: s.tasks.map((t) => ({
				...t,
				optimisticState: OptimisticState.SYNCED,
			})),
		})),
	};
}
