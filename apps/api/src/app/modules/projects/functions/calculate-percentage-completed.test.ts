import { calculatePercentageCompleted } from "./calculate-percentage-completed";

describe("calculatePercentageCompleted", () => {
	describe("when totalCount is zero", () => {
		it("should return 0 to avoid division by zero", () => {
			const result = calculatePercentageCompleted(0, 0);

			expect(result).toBe(0);
		});

		it("should return 0 even if completedCount is positive", () => {
			const result = calculatePercentageCompleted(5, 0);

			expect(result).toBe(0);
		});
	});

	describe("when no tasks are completed", () => {
		it("should return 0 for zero completed out of many", () => {
			const result = calculatePercentageCompleted(0, 10);

			expect(result).toBe(0);
		});
	});

	describe("when all tasks are completed", () => {
		it("should return 100 for a single task", () => {
			const result = calculatePercentageCompleted(1, 1);

			expect(result).toBe(100);
		});

		it("should return 100 for many tasks", () => {
			const result = calculatePercentageCompleted(50, 50);

			expect(result).toBe(100);
		});
	});

	describe("when partially completed", () => {
		it("should return 50 for half completed", () => {
			const result = calculatePercentageCompleted(5, 10);

			expect(result).toBe(50);
		});

		it("should return 70 for 7 out of 10", () => {
			const result = calculatePercentageCompleted(7, 10);

			expect(result).toBe(70);
		});
	});

	describe("rounding behavior (rounds to nearest integer)", () => {
		it("should round 33.3% (1/3) down to 33", () => {
			const result = calculatePercentageCompleted(1, 3);

			expect(result).toBe(33);
		});

		it("should round 66.6% (2/3) up to 67", () => {
			const result = calculatePercentageCompleted(2, 3);

			expect(result).toBe(67);
		});

		it("should round 14.2% (1/7) down to 14", () => {
			const result = calculatePercentageCompleted(1, 7);

			expect(result).toBe(14);
		});

		it("should round 42.8% (3/7) up to 43", () => {
			const result = calculatePercentageCompleted(3, 7);

			expect(result).toBe(43);
		});

		it("should keep 15% exact when no fractional part", () => {
			const result = calculatePercentageCompleted(15, 100);

			expect(result).toBe(15);
		});

		it("should round 0.5 up (midpoint rounds up)", () => {
			const result = calculatePercentageCompleted(1, 200);

			expect(result).toBe(1);
		});
	});
});
