import { vi } from "vitest";
import type { ISigninWithGoogleService } from "./service";

describe("Service:SigninWithGoogle", () => {
	let service: ISigninWithGoogleService;
	// const inputData: ISigninWithGoogleInput = {
	// 	name: 'John Doe'
	// }

	beforeEach(() => {
		// service = new SigninWithGoogleService();
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
