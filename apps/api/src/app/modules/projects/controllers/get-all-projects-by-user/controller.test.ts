import { buildPrivateRequest, buildProject } from "@test/builders";
import { GetAllProjectsByUserController } from "./controller";

describe("GetAllProjectsByUserController", () => {
	const service = { execute: vi.fn() };
	const sut = new GetAllProjectsByUserController(service);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return 200 with projects list", async () => {
		const project1 = buildProject({ id: "p-1", name: "Project 1" });
		const project2 = buildProject({ id: "p-2", name: "Project 2" });

		service.execute.mockResolvedValue({ projects: [project1, project2] });

		const request = buildPrivateRequest({ userId: "u-1" });

		const response = await sut.execute(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ projects: [project1, project2] });
	});

	it("should forward userId to service", async () => {
		service.execute.mockResolvedValue({ projects: [] });

		const request = buildPrivateRequest({ userId: "u-123" });

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith({ userId: "u-123" });
	});

	it("should return 200 with empty list when user has no projects", async () => {
		service.execute.mockResolvedValue({ projects: [] });

		const request = buildPrivateRequest({ userId: "u-1" });

		const response = await sut.execute(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ projects: [] });
	});
});
