import type { Controller } from "@application/interfaces/controller";
import type { IProjectParams } from "@application/interfaces/params";
import type { CreateSectionInput } from "@repo/contracts/sections/create";
import { buildPrivateRequest, buildSection } from "@test/builders";
import type { ICreateSectionService } from "../../services/create-section";
import { CreateSectionController } from "./controller";

describe("CreateSectionController", () => {
	const service: ICreateSectionService = { execute: vi.fn() };
	const sut = new CreateSectionController(service);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return 200 with created section", async () => {
		const section = buildSection({ name: "Backlog" });
		vi.mocked(service.execute).mockResolvedValue({ section });

		const request = buildPrivateRequest({
			body: { name: "Backlog", order: 1 },
			params: { projectId: "p-1" },
			userId: "u-1",
		}) as Controller.Request<"private", CreateSectionInput, IProjectParams>;

		const response = await sut.execute(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ section });
	});

	it("should forward userId and projectId from request to service", async () => {
		vi.mocked(service.execute).mockResolvedValue({ section: buildSection() });

		const request = buildPrivateRequest({
			body: { name: "To do" },
			params: { projectId: "project-42" },
			userId: "user-42",
		}) as Controller.Request<"private", CreateSectionInput, IProjectParams>;

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith(
			expect.objectContaining({
				userId: "user-42",
				projectId: "project-42",
			}),
		);
	});

	it("should forward body fields name and order to service", async () => {
		vi.mocked(service.execute).mockResolvedValue({ section: buildSection() });

		const request = buildPrivateRequest({
			body: { name: "In progress", order: 3 },
			params: { projectId: "p-1" },
			userId: "u-1",
		}) as Controller.Request<"private", CreateSectionInput, IProjectParams>;

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "In progress",
				order: 3,
			}),
		);
	});

	it("should throw when name is missing", async () => {
		const request = buildPrivateRequest({
			body: { order: 1 },
			params: { projectId: "p-1" },
		}) as Controller.Request<"private", CreateSectionInput, IProjectParams>;

		try {
			await sut.execute(request);
			expect.fail("should have thrown");
		} catch (error) {
			expect((error as Error).message).toBe("Validation failed");
		}
	});

	it("should throw when name exceeds 100 chars", async () => {
		const request = buildPrivateRequest({
			body: { name: "a".repeat(101), order: 1 },
			params: { projectId: "p-1" },
		}) as Controller.Request<"private", CreateSectionInput, IProjectParams>;

		try {
			await sut.execute(request);
			expect.fail("should have thrown");
		} catch (error) {
			expect((error as Error).message).toBe("Validation failed");
		}
	});
});
