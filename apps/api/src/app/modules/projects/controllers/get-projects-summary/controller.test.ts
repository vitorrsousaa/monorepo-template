import { buildPrivateRequest, buildProject } from "@test/builders";
import { GetProjectsSummaryController } from "./controller";

describe("GetProjectsSummaryController", () => {
	const service = { execute: vi.fn() };
	const sut = new GetProjectsSummaryController(service);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return 200 with projects summary", async () => {
		const project1 = buildProject({ id: "p-1", name: "Project 1" });
		const project2 = buildProject({ id: "p-2", name: "Project 2" });

		const summary = {
			projects: [
				{
					...project1,
					completedCount: 5,
					totalCount: 10,
					percentageCompleted: 50,
				},
				{
					...project2,
					completedCount: 8,
					totalCount: 10,
					percentageCompleted: 80,
				},
			],
		};

		service.execute.mockResolvedValue(summary);

		const request = buildPrivateRequest({ userId: "u-1" });

		const response = await sut.execute(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(summary);
	});

	it("should forward userId to service", async () => {
		service.execute.mockResolvedValue({ projects: [] });

		const request = buildPrivateRequest({ userId: "u-456" });

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith({ userId: "u-456" });
	});

	it("should return 200 with empty summary when user has no projects", async () => {
		service.execute.mockResolvedValue({ projects: [] });

		const request = buildPrivateRequest({ userId: "u-1" });

		const response = await sut.execute(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ projects: [] });
	});
});
