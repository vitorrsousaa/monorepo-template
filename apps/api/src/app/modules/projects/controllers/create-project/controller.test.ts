import { PROJECT_COLORS } from "@repo/contracts/projects/create";
import { buildPrivateRequest, buildProject } from "@test/builders";
import { CreateProjectController } from "./controller";

describe("CreateProjectController", () => {
	const service = { execute: vi.fn() };
	const sut = new CreateProjectController(service);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return 200 with created project", async () => {
		const project = buildProject({ name: "New Project" });
		service.execute.mockResolvedValue({ project });

		const request = buildPrivateRequest({
			body: { name: "New Project", color: "#7F77DD" },
			userId: "u-1",
		});

		const response = await sut.execute(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ project });
	});

	it("should forward userId from request to service", async () => {
		const project = buildProject();
		service.execute.mockResolvedValue({ project });

		const request = buildPrivateRequest({
			body: { name: "Test", color: "#7F77DD" },
			userId: "u-123",
		});

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith(
			expect.objectContaining({ userId: "u-123" }),
		);
	});

	it("should pass body fields (name, color) to service", async () => {
		const project = buildProject();
		service.execute.mockResolvedValue({ project });

		const request = buildPrivateRequest({
			body: { name: "My Project", color: "#1D9E75" },
			userId: "u-1",
		});

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith({
			userId: "u-1",
			name: "My Project",
			color: "#1D9E75",
		});
	});

	it("should pass optional description to service", async () => {
		const project = buildProject();
		service.execute.mockResolvedValue({ project });

		const request = buildPrivateRequest({
			body: {
				name: "My Project",
				color: "#7F77DD",
				description: "A test description",
			},
			userId: "u-1",
		});

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith(
			expect.objectContaining({ description: "A test description" }),
		);
	});

	it("should throw validation error when name is missing", async () => {
		const request = buildPrivateRequest({
			body: { color: "#7F77DD" },
			userId: "u-1",
		});

		try {
			await sut.execute(request);
			expect.fail("should have thrown");
		} catch (error) {
			expect((error as Error).message).toBe("Validation failed");
		}
	});

	it("should throw validation error for invalid color", async () => {
		const request = buildPrivateRequest({
			body: { name: "Test", color: "#INVALID" },
			userId: "u-1",
		});

		try {
			await sut.execute(request);
			expect.fail("should have thrown");
		} catch (error) {
			expect((error as Error).message).toBe("Validation failed");
		}
	});

	it("should accept all valid colors from PROJECT_COLORS enum", async () => {
		const project = buildProject();
		service.execute.mockResolvedValue({ project });

		for (const color of PROJECT_COLORS) {
			const request = buildPrivateRequest({
				body: { name: "Test", color },
				userId: "u-1",
			});

			await expect(sut.execute(request)).resolves.not.toThrow();
		}

		expect(service.execute).toHaveBeenCalledTimes(PROJECT_COLORS.length);
	});
});
