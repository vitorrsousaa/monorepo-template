import { QUERY_KEYS } from "@/config/query-keys";
import { PROJECTS_DEFAULT_IDS } from "@repo/contracts/enums";
import type { GetProjectDetailResponse } from "@repo/contracts/projects/get-detail";
import type { GetAllSectionsResponse } from "@repo/contracts/sections/get-all";
import { buildProject } from "@test/builders/build-project";
import { buildSectionWithTasks } from "@test/builders/build-section";
import { buildTask } from "@test/builders/build-task";
import { createQueryWrapper, createTestQueryClient } from "@test/query-client";
import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useGetProjectDetail } from "./use-get-project-detail";

vi.mock("../services/get-project-detail", () => ({
	getProjectDetail: vi.fn(),
}));

import { getProjectDetail } from "../services/get-project-detail";

const mockedGetProjectDetail = vi.mocked(getProjectDetail);

function buildMockResponse(
	overrides?: Partial<GetProjectDetailResponse>,
): GetProjectDetailResponse {
	return {
		project: {
			...buildProject({ id: "p1" }),
			completedCount: 0,
			totalCount: 0,
			percentageCompleted: 0,
		},
		sections: [
			buildSectionWithTasks({
				id: PROJECTS_DEFAULT_IDS.INBOX,
				name: "Inbox",
				projectId: "p1",
			}),
			buildSectionWithTasks({
				id: "section-1",
				name: "To Do",
				projectId: "p1",
				tasks: [buildTask()],
			}),
			buildSectionWithTasks({
				id: "section-2",
				name: "Done",
				projectId: "p1",
			}),
		],
		...overrides,
	};
}

describe("useGetProjectDetail", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("Should return project detail when fetch succeeds", async () => {
		// Arrange
		const qc = createTestQueryClient();
		const wrapper = createQueryWrapper(qc);
		const mockResponse = buildMockResponse();
		mockedGetProjectDetail.mockResolvedValueOnce(mockResponse);

		// Act
		const { result } = renderHook(
			() => useGetProjectDetail({ projectId: "p1" }),
			{ wrapper },
		);

		// Assert
		await waitFor(() => {
			expect(result.current.isFetchingProjectDetail).toBe(false);
		});

		expect(result.current.projectDetail).toBeDefined();
		expect(result.current.projectDetail?.project.id).toBe("p1");
		expect(result.current.projectDetail?.sections).toHaveLength(3);
		expect(result.current.isErrorProjectDetail).toBe(false);
	});

	it("Should populate sections cache without inbox section when fetch succeeds", async () => {
		// Arrange
		const qc = createTestQueryClient();
		const wrapper = createQueryWrapper(qc);
		const mockResponse = buildMockResponse();
		mockedGetProjectDetail.mockResolvedValueOnce(mockResponse);

		// Act
		renderHook(() => useGetProjectDetail({ projectId: "p1" }), { wrapper });

		// Assert
		await waitFor(() => {
			const cached = qc.getQueryData<GetAllSectionsResponse>(
				QUERY_KEYS.SECTIONS.BY_PROJECT("p1"),
			);
			expect(cached).toBeDefined();
		});

		const cached = qc.getQueryData<GetAllSectionsResponse>(
			QUERY_KEYS.SECTIONS.BY_PROJECT("p1"),
		);
		expect(cached?.sections).toHaveLength(2);
		expect(cached?.total).toBe(2);
		expect(
			cached?.sections.some((s) => s.id === PROJECTS_DEFAULT_IDS.INBOX),
		).toBe(false);
		expect(cached?.sections.some((s) => s.id === "section-1")).toBe(true);
		expect(cached?.sections.some((s) => s.id === "section-2")).toBe(true);
	});

	it("Should include all non-inbox sections in sections cache when project has multiple sections", async () => {
		// Arrange
		const qc = createTestQueryClient();
		const wrapper = createQueryWrapper(qc);
		const mockResponse = buildMockResponse({
			sections: [
				buildSectionWithTasks({
					id: PROJECTS_DEFAULT_IDS.INBOX,
					name: "Inbox",
					projectId: "p1",
				}),
				buildSectionWithTasks({
					id: "section-a",
					name: "Backlog",
					projectId: "p1",
				}),
				buildSectionWithTasks({
					id: "section-b",
					name: "In Progress",
					projectId: "p1",
					tasks: [buildTask({ id: "t1" }), buildTask({ id: "t2" })],
				}),
				buildSectionWithTasks({
					id: "section-c",
					name: "Review",
					projectId: "p1",
				}),
				buildSectionWithTasks({
					id: "section-d",
					name: "Done",
					projectId: "p1",
				}),
			],
		});
		mockedGetProjectDetail.mockResolvedValueOnce(mockResponse);

		// Act
		renderHook(() => useGetProjectDetail({ projectId: "p1" }), { wrapper });

		// Assert
		await waitFor(() => {
			const cached = qc.getQueryData<GetAllSectionsResponse>(
				QUERY_KEYS.SECTIONS.BY_PROJECT("p1"),
			);
			expect(cached).toBeDefined();
		});

		const cached = qc.getQueryData<GetAllSectionsResponse>(
			QUERY_KEYS.SECTIONS.BY_PROJECT("p1"),
		);
		expect(cached?.sections).toHaveLength(4);
		expect(cached?.total).toBe(4);
		const cachedIds = cached?.sections.map((s) => s.id);
		expect(cachedIds).toContain("section-a");
		expect(cachedIds).toContain("section-b");
		expect(cachedIds).toContain("section-c");
		expect(cachedIds).toContain("section-d");
		expect(cachedIds).not.toContain(PROJECTS_DEFAULT_IDS.INBOX);
	});

	it("Should not fetch when enabled is false", async () => {
		// Arrange
		const qc = createTestQueryClient();
		const wrapper = createQueryWrapper(qc);

		// Act
		renderHook(() => useGetProjectDetail({ projectId: "p1", enabled: false }), {
			wrapper,
		});

		// Assert
		await new Promise((r) => setTimeout(r, 50));
		expect(mockedGetProjectDetail).not.toHaveBeenCalled();
	});

	it("Should not fetch when projectId is empty string", async () => {
		// Arrange
		const qc = createTestQueryClient();
		const wrapper = createQueryWrapper(qc);

		// Act
		renderHook(() => useGetProjectDetail({ projectId: "" }), { wrapper });

		// Assert
		await new Promise((r) => setTimeout(r, 50));
		expect(mockedGetProjectDetail).not.toHaveBeenCalled();
	});

	it("Should return error state when service rejects", async () => {
		// Arrange
		const qc = createTestQueryClient();
		const wrapper = createQueryWrapper(qc);
		mockedGetProjectDetail.mockRejectedValueOnce(new Error("Network error"));

		// Act
		const { result } = renderHook(
			() => useGetProjectDetail({ projectId: "p1" }),
			{ wrapper },
		);

		// Assert
		await waitFor(() => {
			expect(result.current.isErrorProjectDetail).toBe(true);
		});
	});

	it("Should return loading state when fetch is pending", async () => {
		// Arrange
		const qc = createTestQueryClient();
		const wrapper = createQueryWrapper(qc);
		mockedGetProjectDetail.mockImplementation(
			() => new Promise(() => {}), // never resolves
		);

		// Act
		const { result } = renderHook(
			() => useGetProjectDetail({ projectId: "p1" }),
			{ wrapper },
		);

		// Assert
		expect(result.current.isFetchingProjectDetail).toBe(true);
	});
});
