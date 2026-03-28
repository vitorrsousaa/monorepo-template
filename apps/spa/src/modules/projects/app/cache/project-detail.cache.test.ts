import { QUERY_KEYS } from "@/config/query-keys";
import type { ProjectDetailWithOptimisticState } from "@/modules/projects/app/hooks/use-get-project-detail";
import { OptimisticState } from "@/utils/types";
import { QueryClient } from "@tanstack/react-query";
import { buildProjectDetail } from "@test/builders/build-project-detail";
import { buildSectionWithTasks } from "@test/builders/build-section";
import { buildTask } from "@test/builders/build-task";
import { projectDetailCache } from "./project-detail.cache";

const PROJECT_ID = "project-1";

function setupCache(
	queryClient: QueryClient,
	data: ProjectDetailWithOptimisticState,
) {
	const queryKey = QUERY_KEYS.PROJECTS.DETAIL(PROJECT_ID);
	queryClient.setQueryData<ProjectDetailWithOptimisticState>(queryKey, data);
}

function readCache(
	queryClient: QueryClient,
): ProjectDetailWithOptimisticState | undefined {
	return queryClient.getQueryData<ProjectDetailWithOptimisticState>(
		QUERY_KEYS.PROJECTS.DETAIL(PROJECT_ID),
	);
}

describe("projectDetailCache", () => {
	describe("exists", () => {
		it("Should return false when cache is empty", () => {
			// Arrange
			const queryClient = new QueryClient();
			const cache = projectDetailCache(queryClient, PROJECT_ID);

			// Act
			const result = cache.exists();

			// Assert
			expect(result).toBe(false);
		});

		it("Should return true when cache has data", () => {
			// Arrange
			const queryClient = new QueryClient();
			const detail = buildProjectDetail();
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);

			// Act
			const result = cache.exists();

			// Assert
			expect(result).toBe(true);
		});
	});

	describe("addFullTaskToSection", () => {
		it("Should append task with PENDING state when section exists", () => {
			// Arrange
			const queryClient = new QueryClient();
			const section = buildSectionWithTasks({ id: "section-1", tasks: [] });
			const detail = buildProjectDetail({ sections: [section] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);
			const task = buildTask({ id: "new-task" });

			// Act
			cache.addFullTaskToSection("section-1", task);

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			expect(cached?.sections[0].tasks).toHaveLength(1);
			expect(cached?.sections[0].tasks[0].id).toBe("new-task");
			expect(cached?.sections[0].tasks[0].optimisticState).toBe(
				OptimisticState.PENDING,
			);
		});

		it("Should leave cache intact when cache is undefined", () => {
			// Arrange
			const queryClient = new QueryClient();
			const cache = projectDetailCache(queryClient, PROJECT_ID);
			const task = buildTask({ id: "new-task" });

			// Act
			cache.addFullTaskToSection("section-1", task);

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeUndefined();
		});
	});

	describe("addTaskToSection", () => {
		it("Should append partial task with defaults and PENDING state when section exists", () => {
			// Arrange
			const queryClient = new QueryClient();
			const section = buildSectionWithTasks({ id: "section-1", tasks: [] });
			const detail = buildProjectDetail({ sections: [section] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);

			// Act
			cache.addTaskToSection("section-1", "temp-id", { title: "New Task" });

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			const addedTask = cached?.sections[0].tasks[0];
			expect(addedTask?.id).toBe("temp-id");
			expect(addedTask?.title).toBe("New Task");
			expect(addedTask?.projectId).toBe(PROJECT_ID);
			expect(addedTask?.sectionId).toBe("section-1");
			expect(addedTask?.completed).toBe(false);
			expect(addedTask?.description).toBeNull();
			expect(addedTask?.completedAt).toBeNull();
			expect(addedTask?.dueDate).toBeNull();
			expect(addedTask?.priority).toBeNull();
			expect(addedTask?.optimisticState).toBe(OptimisticState.PENDING);
		});

		it("Should use provided data for optional fields when data is supplied", () => {
			// Arrange
			const queryClient = new QueryClient();
			const section = buildSectionWithTasks({ id: "section-1", tasks: [] });
			const detail = buildProjectDetail({ sections: [section] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);

			// Act
			cache.addTaskToSection("section-1", "temp-id", {
				title: "Task with details",
				description: "A description",
				dueDate: "2026-06-01T00:00:00.000Z",
				priority: "high",
			});

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			const addedTask = cached?.sections[0].tasks[0];
			expect(addedTask?.title).toBe("Task with details");
			expect(addedTask?.description).toBe("A description");
			expect(addedTask?.dueDate).toBe("2026-06-01T00:00:00.000Z");
			expect(addedTask?.priority).toBe("high");
			expect(addedTask?.optimisticState).toBe(OptimisticState.PENDING);
		});
	});

	describe("replaceTaskInSection", () => {
		it("Should replace temp task with real task and SYNCED state when temp exists", () => {
			// Arrange
			const queryClient = new QueryClient();
			const tempTask = buildTask({ id: "temp-id", title: "Temp" });
			const section = buildSectionWithTasks({
				id: "section-1",
				tasks: [tempTask],
			});
			const detail = buildProjectDetail({ sections: [section] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);
			const realTask = buildTask({ id: "real-id", title: "Real Task" });

			// Act
			cache.replaceTaskInSection("section-1", "temp-id", realTask);

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			expect(cached?.sections[0].tasks).toHaveLength(1);
			expect(cached?.sections[0].tasks[0].id).toBe("real-id");
			expect(cached?.sections[0].tasks[0].title).toBe("Real Task");
			expect(cached?.sections[0].tasks[0].optimisticState).toBe(
				OptimisticState.SYNCED,
			);
		});

		it("Should leave other tasks unchanged when replacing specific task", () => {
			// Arrange
			const queryClient = new QueryClient();
			const existingTask = buildTask({
				id: "existing-task",
				title: "Existing",
			});
			const tempTask = buildTask({ id: "temp-id", title: "Temp" });
			const section = buildSectionWithTasks({
				id: "section-1",
				tasks: [existingTask, tempTask],
			});
			const detail = buildProjectDetail({ sections: [section] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);
			const realTask = buildTask({ id: "real-id", title: "Real Task" });

			// Act
			cache.replaceTaskInSection("section-1", "temp-id", realTask);

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			expect(cached?.sections[0].tasks).toHaveLength(2);
			expect(cached?.sections[0].tasks[0].id).toBe("existing-task");
			expect(cached?.sections[0].tasks[0].title).toBe("Existing");
			expect(cached?.sections[0].tasks[1].id).toBe("real-id");
		});
	});

	describe("removeTaskFromSection", () => {
		it("Should remove task from section when task exists", () => {
			// Arrange
			const queryClient = new QueryClient();
			const task = buildTask({ id: "task-to-remove" });
			const section = buildSectionWithTasks({
				id: "section-1",
				tasks: [task],
			});
			const detail = buildProjectDetail({ sections: [section] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);

			// Act
			cache.removeTaskFromSection("section-1", "task-to-remove");

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			expect(cached?.sections[0].tasks).toHaveLength(0);
		});

		it("Should leave section unchanged when task does not exist", () => {
			// Arrange
			const queryClient = new QueryClient();
			const task = buildTask({ id: "existing-task" });
			const section = buildSectionWithTasks({
				id: "section-1",
				tasks: [task],
			});
			const detail = buildProjectDetail({ sections: [section] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);

			// Act
			cache.removeTaskFromSection("section-1", "nonexistent-task");

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			expect(cached?.sections[0].tasks).toHaveLength(1);
			expect(cached?.sections[0].tasks[0].id).toBe("existing-task");
		});
	});

	describe("patchTaskCompletionOptimistic", () => {
		it("Should set completed to true and completedAt to ISO string when completing", () => {
			// Arrange
			const queryClient = new QueryClient();
			const task = buildTask({
				id: "task-1",
				completed: false,
				completedAt: null,
			});
			const section = buildSectionWithTasks({
				id: "section-1",
				tasks: [task],
			});
			const detail = buildProjectDetail({ sections: [section] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);

			// Act
			cache.patchTaskCompletionOptimistic("task-1", true);

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			const patchedTask = cached?.sections[0].tasks[0];
			expect(patchedTask?.completed).toBe(true);
			expect(patchedTask?.completedAt).toEqual(expect.any(String));
			expect(() =>
				new Date(patchedTask?.completedAt ?? "").toISOString(),
			).not.toThrow();
		});

		it("Should set completed to false and completedAt to null when uncompleting", () => {
			// Arrange
			const queryClient = new QueryClient();
			const task = buildTask({
				id: "task-1",
				completed: true,
				completedAt: "2026-03-01T00:00:00.000Z",
			});
			const section = buildSectionWithTasks({
				id: "section-1",
				tasks: [task],
			});
			const detail = buildProjectDetail({ sections: [section] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);

			// Act
			cache.patchTaskCompletionOptimistic("task-1", false);

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			const patchedTask = cached?.sections[0].tasks[0];
			expect(patchedTask?.completed).toBe(false);
			expect(patchedTask?.completedAt).toBeNull();
		});

		it("Should find task across multiple sections when task is not in first section", () => {
			// Arrange
			const queryClient = new QueryClient();
			const taskInSecondSection = buildTask({
				id: "target-task",
				completed: false,
			});
			const section1 = buildSectionWithTasks({ id: "section-1", tasks: [] });
			const section2 = buildSectionWithTasks({
				id: "section-2",
				tasks: [taskInSecondSection],
			});
			const detail = buildProjectDetail({ sections: [section1, section2] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);

			// Act
			cache.patchTaskCompletionOptimistic("target-task", true);

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			expect(cached?.sections[0].tasks).toHaveLength(0);
			expect(cached?.sections[1].tasks[0].completed).toBe(true);
			expect(cached?.sections[1].tasks[0].completedAt).toEqual(
				expect.any(String),
			);
		});

		it("Should leave cache intact when task does not exist", () => {
			// Arrange
			const queryClient = new QueryClient();
			const task = buildTask({ id: "existing-task", completed: false });
			const section = buildSectionWithTasks({
				id: "section-1",
				tasks: [task],
			});
			const detail = buildProjectDetail({ sections: [section] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);

			// Act
			cache.patchTaskCompletionOptimistic("nonexistent-task", true);

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			expect(cached?.sections[0].tasks[0].completed).toBe(false);
			expect(cached?.sections[0].tasks[0].completedAt).toBeNull();
		});
	});

	describe("replaceTaskFromServer", () => {
		it("Should replace matching task with server data and SYNCED state when task exists", () => {
			// Arrange
			const queryClient = new QueryClient();
			const oldTask = buildTask({ id: "task-1", title: "Old Title" });
			const section = buildSectionWithTasks({
				id: "section-1",
				tasks: [oldTask],
			});
			const detail = buildProjectDetail({ sections: [section] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);
			const serverTask = buildTask({
				id: "task-1",
				title: "Updated from Server",
			});

			// Act
			cache.replaceTaskFromServer(serverTask);

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			expect(cached?.sections[0].tasks[0].title).toBe("Updated from Server");
			expect(cached?.sections[0].tasks[0].optimisticState).toBe(
				OptimisticState.SYNCED,
			);
		});

		it("Should search across all sections when replacing task", () => {
			// Arrange
			const queryClient = new QueryClient();
			const taskInSection2 = buildTask({ id: "task-in-s2", title: "Old" });
			const section1 = buildSectionWithTasks({ id: "section-1", tasks: [] });
			const section2 = buildSectionWithTasks({
				id: "section-2",
				tasks: [taskInSection2],
			});
			const detail = buildProjectDetail({ sections: [section1, section2] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);
			const serverTask = buildTask({ id: "task-in-s2", title: "Updated" });

			// Act
			cache.replaceTaskFromServer(serverTask);

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			expect(cached?.sections[1].tasks[0].title).toBe("Updated");
			expect(cached?.sections[1].tasks[0].optimisticState).toBe(
				OptimisticState.SYNCED,
			);
		});

		it("Should leave cache intact when task does not exist in any section", () => {
			// Arrange
			const queryClient = new QueryClient();
			const existingTask = buildTask({
				id: "existing-task",
				title: "Unchanged",
			});
			const section = buildSectionWithTasks({
				id: "section-1",
				tasks: [existingTask],
			});
			const detail = buildProjectDetail({ sections: [section] });
			setupCache(queryClient, detail);
			const cache = projectDetailCache(queryClient, PROJECT_ID);
			const serverTask = buildTask({ id: "nonexistent-task", title: "Server" });

			// Act
			cache.replaceTaskFromServer(serverTask);

			// Assert
			const cached = readCache(queryClient);
			expect(cached).toBeDefined();
			expect(cached?.sections[0].tasks).toHaveLength(1);
			expect(cached?.sections[0].tasks[0].id).toBe("existing-task");
			expect(cached?.sections[0].tasks[0].title).toBe("Unchanged");
		});
	});
});
