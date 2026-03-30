import { buildSection } from "@test/builders";
import { mockSectionsRepository } from "@test/mocks";
import { CreateSectionService } from "./service";

describe("CreateSectionService", () => {
	const repo = mockSectionsRepository();
	const sut = new CreateSectionService(repo);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create section with provided order", async () => {
		const createdSection = buildSection({ order: 10 });
		vi.mocked(repo.create).mockResolvedValue(createdSection);

		const result = await sut.execute({
			userId: "u-1",
			projectId: "p-1",
			name: "Backlog",
			order: 10,
		});

		expect(repo.getAllByProject).not.toHaveBeenCalled();
		expect(repo.create).toHaveBeenCalledWith({
			userId: "u-1",
			projectId: "p-1",
			name: "Backlog",
			order: 10,
		});
		expect(result.section).toEqual(createdSection);
	});

	it("should auto-calculate order when not provided", async () => {
		vi.mocked(repo.getAllByProject).mockResolvedValue([
			buildSection({ order: 1 }),
			buildSection({ id: "section-002", order: 3 }),
		]);
		vi.mocked(repo.create).mockResolvedValue(buildSection({ order: 4 }));

		await sut.execute({
			userId: "u-1",
			projectId: "p-1",
			name: "In progress",
		});

		expect(repo.getAllByProject).toHaveBeenCalledWith("p-1", "u-1");
		expect(repo.create).toHaveBeenCalledWith(
			expect.objectContaining({
				order: 4,
			}),
		);
	});

	it("should set order to 1 when project has no sections", async () => {
		vi.mocked(repo.getAllByProject).mockResolvedValue([]);
		vi.mocked(repo.create).mockResolvedValue(buildSection({ order: 1 }));

		await sut.execute({
			userId: "u-1",
			projectId: "p-1",
			name: "To do",
		});

		expect(repo.create).toHaveBeenCalledWith(
			expect.objectContaining({
				order: 1,
			}),
		);
	});

	it("should forward userId and projectId to repository", async () => {
		vi.mocked(repo.create).mockResolvedValue(buildSection());

		await sut.execute({
			userId: "user-42",
			projectId: "project-42",
			name: "Review",
			order: 2,
		});

		expect(repo.create).toHaveBeenCalledWith({
			userId: "user-42",
			projectId: "project-42",
			name: "Review",
			order: 2,
		});
	});

	it("should return created section", async () => {
		const section = buildSection({ name: "Done" });
		vi.mocked(repo.create).mockResolvedValue(section);

		const result = await sut.execute({
			userId: "u-1",
			projectId: "p-1",
			name: "Done",
			order: 5,
		});

		expect(result.section).toEqual(section);
	});
});
