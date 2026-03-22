import { buildTask, buildPrivateRequest } from "@test/builders";
import type { ICreateTasksService } from "../../services/create";
import { CreateTasksController } from "./controller";

describe("CreateTasksController", () => {
	const service: ICreateTasksService = { execute: vi.fn() };
	const sut = new CreateTasksController(service);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return 200 with created task", async () => {
		const task = buildTask({ title: "My task" });
		vi.mocked(service.execute).mockResolvedValue({ task });

		const request = buildPrivateRequest({
			body: { title: "My task" },
			userId: "u-1",
		});

		const response = await sut.execute(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ task });
	});

	it("should forward userId from request to service", async () => {
		vi.mocked(service.execute).mockResolvedValue({ task: buildTask() });

		const request = buildPrivateRequest({
			body: { title: "Task" },
			userId: "u-42",
		});

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith(
			expect.objectContaining({ userId: "u-42" }),
		);
	});

	it("should throw when title is missing", async () => {
		const request = buildPrivateRequest({ body: {} });

		try {
			await sut.execute(request);
			expect.fail("should have thrown");
		} catch (error) {
			expect((error as Error).message).toBe("Validation failed");
		}
	});

	it("should pass optional fields to service", async () => {
		vi.mocked(service.execute).mockResolvedValue({ task: buildTask() });

		const body = {
			title: "Task",
			description: "desc",
			priority: "high",
			dueDate: "2024-06-15",
			projectId: "550e8400-e29b-41d4-a716-446655440000",
		};
		const request = buildPrivateRequest({ body, userId: "u-1" });

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Task",
				description: "desc",
				priority: "high",
				userId: "u-1",
			}),
		);
	});
});
