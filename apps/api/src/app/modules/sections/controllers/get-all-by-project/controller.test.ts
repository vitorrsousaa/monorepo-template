import type { Controller } from "@application/interfaces/controller";
import type { IProjectParams } from "@application/interfaces/params";
import { buildPrivateRequest, buildSection } from "@test/builders";
import type { IGetAllByProjectService } from "../../services/get-all-by-project";
import { GetAllByProjectController } from "./controller";

describe("GetAllByProjectController", () => {
	const service: IGetAllByProjectService = { execute: vi.fn() };
	const sut = new GetAllByProjectController(service);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return 200 with sections and total", async () => {
		const sections = [buildSection(), buildSection({ id: "section-002" })];
		vi.mocked(service.execute).mockResolvedValue({ sections, total: 2 });

		const request = buildPrivateRequest({
			params: { projectId: "p-1" },
			userId: "u-1",
		}) as Controller.Request<
			"private",
			Record<string, unknown>,
			IProjectParams
		>;

		const response = await sut.execute(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ sections, total: 2 });
	});

	it("should forward userId and projectId from request to service", async () => {
		vi.mocked(service.execute).mockResolvedValue({ sections: [], total: 0 });

		const request = buildPrivateRequest({
			params: { projectId: "project-42" },
			userId: "user-42",
		}) as Controller.Request<
			"private",
			Record<string, unknown>,
			IProjectParams
		>;

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith({
			userId: "user-42",
			projectId: "project-42",
		});
	});

	it("should return empty sections when project has none", async () => {
		vi.mocked(service.execute).mockResolvedValue({ sections: [], total: 0 });

		const request = buildPrivateRequest({
			params: { projectId: "p-1" },
			userId: "u-1",
		}) as Controller.Request<
			"private",
			Record<string, unknown>,
			IProjectParams
		>;

		const response = await sut.execute(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ sections: [], total: 0 });
	});
});
