import { buildSection } from "@test/builders";
import { mockSectionsRepository } from "@test/mocks";
import { GetAllByProjectService } from "./service";

describe("GetAllByProjectService", () => {
	const repo = mockSectionsRepository();
	const sut = new GetAllByProjectService(repo);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return sections from repository", async () => {
		const sections = [buildSection(), buildSection({ id: "section-002" })];
		vi.mocked(repo.getAllByProject).mockResolvedValue(sections);

		const result = await sut.execute({ userId: "u-1", projectId: "p-1" });

		expect(result.sections).toEqual(sections);
	});

	it("should return correct total count", async () => {
		const sections = [buildSection(), buildSection({ id: "section-002" })];
		vi.mocked(repo.getAllByProject).mockResolvedValue(sections);

		const result = await sut.execute({ userId: "u-1", projectId: "p-1" });

		expect(result.total).toBe(2);
	});

	it("should return empty array when project has no sections", async () => {
		vi.mocked(repo.getAllByProject).mockResolvedValue([]);

		const result = await sut.execute({ userId: "u-1", projectId: "p-1" });

		expect(result.sections).toEqual([]);
		expect(result.total).toBe(0);
	});

	it("should forward projectId and userId to repository", async () => {
		vi.mocked(repo.getAllByProject).mockResolvedValue([]);

		await sut.execute({ userId: "user-42", projectId: "project-42" });

		expect(repo.getAllByProject).toHaveBeenCalledWith("project-42", "user-42");
	});
});
