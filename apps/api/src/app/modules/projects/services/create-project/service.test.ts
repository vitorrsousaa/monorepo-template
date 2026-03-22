import { buildProject } from "@test/builders";
import { mockProjectsRepository } from "@test/mocks";
import { CreateProjectService } from "./service";

describe("CreateProjectService", () => {
	const repo = mockProjectsRepository();
	const sut = new CreateProjectService(repo);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create project via repository and return it", async () => {
		const project = buildProject({ name: "New project" });
		vi.mocked(repo.create).mockResolvedValue(project);

		const result = await sut.execute({
			userId: "u-1",
			name: "New project",
			color: "#7F77DD",
		});

		expect(result.project).toEqual(project);
		expect(repo.create).toHaveBeenCalledWith({
			userId: "u-1",
			name: "New project",
			color: "#7F77DD",
		});
	});

	it("should pass description when provided", async () => {
		vi.mocked(repo.create).mockResolvedValue(buildProject());

		await sut.execute({
			userId: "u-1",
			name: "Project",
			color: "#1D9E75",
			description: "A description",
		});

		expect(repo.create).toHaveBeenCalledWith(
			expect.objectContaining({ description: "A description" }),
		);
	});
});
