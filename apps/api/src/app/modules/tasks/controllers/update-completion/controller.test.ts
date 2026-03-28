import { buildPrivateRequest, buildTask } from "@test/builders";
import type { IUpdateTaskCompletionService } from "../../services/update-completion";
import { UpdateTaskCompletionController } from "./controller";

describe("UpdateTaskCompletionController", () => {
	const service: IUpdateTaskCompletionService = { execute: vi.fn() };
	const sut = new UpdateTaskCompletionController(service);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return 200 with updated task", async () => {
		const task = buildTask({ completed: true });
		vi.mocked(service.execute).mockResolvedValue({ task });

		const request = buildPrivateRequest({
			body: {},
			params: { taskId: "t-1" },
			userId: "u-1",
		});

		// biome-ignore lint/suspicious/noExplicitAny: test helper returns generic request
		const response = await sut.execute(request as any);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ task });
	});

	it("should forward taskId from params and userId from request", async () => {
		vi.mocked(service.execute).mockResolvedValue({ task: buildTask() });

		const request = buildPrivateRequest({
			body: {},
			params: { taskId: "t-42" },
			userId: "u-99",
		});

		// biome-ignore lint/suspicious/noExplicitAny: test helper returns generic request
		await sut.execute(request as any);

		expect(service.execute).toHaveBeenCalledWith(
			expect.objectContaining({
				taskId: "t-42",
				userId: "u-99",
			}),
		);
	});

	it("should forward projectId from body when provided", async () => {
		vi.mocked(service.execute).mockResolvedValue({ task: buildTask() });

		const request = buildPrivateRequest({
			body: { projectId: "550e8400-e29b-41d4-a716-446655440000" },
			params: { taskId: "t-1" },
			userId: "u-1",
		});

		// biome-ignore lint/suspicious/noExplicitAny: test helper returns generic request
		await sut.execute(request as any);

		expect(service.execute).toHaveBeenCalledWith(
			expect.objectContaining({
				projectId: "550e8400-e29b-41d4-a716-446655440000",
			}),
		);
	});
});
