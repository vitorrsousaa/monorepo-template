import { buildUser } from "@test/builders";
import { mockSharingRepository, mockUserRepository } from "@test/mocks";
import { UserSearchService } from "./service";

describe("UserSearchService", () => {
	const sharingRepo = mockSharingRepository();
	const userRepo = mockUserRepository();
	const sut = new UserSearchService(sharingRepo, userRepo);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return user when email is found and user exists", async () => {
		const user = buildUser({
			id: "u-1",
			name: "Jane",
			email: "jane@example.com",
		});
		vi.mocked(sharingRepo.getUserIdByEmail).mockResolvedValue("u-1");
		vi.mocked(userRepo.getById).mockResolvedValue(user);

		const result = await sut.execute({ email: "jane@example.com" });

		expect(result.user).toEqual({
			userId: "u-1",
			name: "Jane",
			email: "jane@example.com",
		});
	});

	it("should return null when email is not found", async () => {
		vi.mocked(sharingRepo.getUserIdByEmail).mockResolvedValue(null);

		const result = await sut.execute({ email: "unknown@example.com" });

		expect(result.user).toBeNull();
		expect(userRepo.getById).not.toHaveBeenCalled();
	});

	it("should return null when email is found but user does not exist", async () => {
		vi.mocked(sharingRepo.getUserIdByEmail).mockResolvedValue("u-2");
		vi.mocked(userRepo.getById).mockResolvedValue(null);

		const result = await sut.execute({ email: "ghost@example.com" });

		expect(result.user).toBeNull();
	});

	it("should call getUserIdByEmail with the correct email", async () => {
		vi.mocked(sharingRepo.getUserIdByEmail).mockResolvedValue(null);

		await sut.execute({ email: "test@example.com" });

		expect(sharingRepo.getUserIdByEmail).toHaveBeenCalledWith(
			"test@example.com",
		);
	});

	it("should call getById with the userId from getUserIdByEmail", async () => {
		vi.mocked(sharingRepo.getUserIdByEmail).mockResolvedValue("u-99");
		vi.mocked(userRepo.getById).mockResolvedValue(null);

		await sut.execute({ email: "test@example.com" });

		expect(userRepo.getById).toHaveBeenCalledWith("u-99");
	});
});
