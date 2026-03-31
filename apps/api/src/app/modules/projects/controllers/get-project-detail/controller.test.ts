import {
	buildPrivateRequest,
	buildProject,
	buildSection,
} from "@test/builders";
import { ProjectNotFound } from "../../errors/project-not-found";
import { GetProjectDetailController } from "./controller";

describe("GetProjectDetailController", () => {
	const service = { execute: vi.fn() };
	const sut = new GetProjectDetailController(service);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return 200 with project detail", async () => {
		const project = buildProject({ id: "p-1", name: "Test Project" });
		const section = buildSection({ id: "s-1", name: "Section 1" });

		const serviceResult = {
			data: {
				project: {
					...project,
					completedCount: 5,
					totalCount: 10,
					percentageCompleted: 50,
				},
				sections: [{ ...section, tasks: [] }],
			},
		};

		service.execute.mockResolvedValue(serviceResult);

		const request = buildPrivateRequest({
			userId: "u-1",
			params: { projectId: "p-1" },
		});

		const response = await sut.execute(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(serviceResult.data);
	});

	it("should forward userId and projectId to service", async () => {
		const serviceResult = {
			data: {
				project: buildProject(),
				sections: [],
			},
		};

		service.execute.mockResolvedValue(serviceResult);

		const request = buildPrivateRequest({
			userId: "u-123",
			params: { projectId: "p-456" },
		});

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith({
			userId: "u-123",
			projectId: "p-456",
		});
	});

	it("should propagate service error when project not found", async () => {
		service.execute.mockRejectedValue(new ProjectNotFound());

		const request = buildPrivateRequest({
			userId: "u-1",
			params: { projectId: "nonexistent" },
		});

		await expect(sut.execute(request)).rejects.toThrow(ProjectNotFound);
	});
});
