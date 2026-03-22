import { buildProject } from "@test/builders";
import { mockProjectsRepository } from "@test/mocks";
import { GetAllProjectsByUserService } from "./service";

describe("GetAllProjectsByUserService", () => {
	const repo = mockProjectsRepository();
	const service = new GetAllProjectsByUserService(repo);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return projects from repository", async () => {
		const projects = [
			buildProject({ name: "Project A" }),
			buildProject({ name: "Project B" }),
		];
		vi.mocked(repo.getAllProjectsByUser).mockResolvedValue(projects);

		const result = await service.execute({ userId: "u-1" });

		expect(result.projects).toEqual(projects);
		expect(repo.getAllProjectsByUser).toHaveBeenCalledWith("u-1");
	});

	it("should return empty array when no projects", async () => {
		vi.mocked(repo.getAllProjectsByUser).mockResolvedValue([]);

		const result = await service.execute({ userId: "u-1" });

		expect(result.projects).toEqual([]);
	});
});
