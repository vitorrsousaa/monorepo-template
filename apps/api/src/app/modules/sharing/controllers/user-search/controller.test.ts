import { buildPrivateRequest } from "@test/builders";
import type { IUserSearchService } from "../../services/user-search";
import { UserSearchController } from "./controller";

describe("UserSearchController", () => {
	const service: IUserSearchService = { execute: vi.fn() };
	const sut = new UserSearchController(service);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return 200 with found user inside users array", async () => {
		const userResult = {
			userId: "u-1",
			name: "Alice",
			email: "alice@example.com",
		};
		vi.mocked(service.execute).mockResolvedValue({ user: userResult });

		const request = buildPrivateRequest({
			queryParams: { email: "alice@example.com" },
		});

		const response = await sut.execute(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ users: [userResult] });
	});

	it("should return 200 with empty users array when service returns null", async () => {
		vi.mocked(service.execute).mockResolvedValue({ user: null });

		const request = buildPrivateRequest({
			queryParams: { email: "unknown@example.com" },
		});

		const response = await sut.execute(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ users: [] });
	});

	it("should forward email from queryParams to service", async () => {
		vi.mocked(service.execute).mockResolvedValue({ user: null });

		const request = buildPrivateRequest({
			queryParams: { email: "bob@example.com" },
		});

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith({ email: "bob@example.com" });
	});

	it("should default to empty string when queryParams.email is undefined", async () => {
		vi.mocked(service.execute).mockResolvedValue({ user: null });

		const request = buildPrivateRequest({ queryParams: {} });

		await sut.execute(request);

		expect(service.execute).toHaveBeenCalledWith({ email: "" });
	});
});
