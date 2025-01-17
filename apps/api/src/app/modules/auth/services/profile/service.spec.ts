import { vi } from "vitest";
import type { IProfileService } from "./service";

describe("Service:Profile", () => {
	let service: IProfileService;
	// const inputData: IProfileInput = {
	// 	name: 'John Doe'
	// }

	beforeEach(() => {
		// service = new ProfileService();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("Should correct", async () => {
		// Arrange

		// Act
		// await service.execute(inputData);

		// Assert
		expect(true).toBe(true);
	});
});
