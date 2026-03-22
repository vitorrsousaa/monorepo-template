import { buildSection } from "@test/builders";
import { SectionDynamoMapper } from "./section-mapper";
import type { SectionDynamoDBEntity } from "./types";

describe("SectionDynamoMapper", () => {
	const mapper = new SectionDynamoMapper();

	describe("toDomain", () => {
		it("should convert DynamoDB entity to domain section", () => {
			const dbEntity: SectionDynamoDBEntity = {
				PK: "USER#u-1#PROJECT#p-1",
				SK: "SECTION#s-1",
				id: "s-1",
				user_id: "u-1",
				project_id: "p-1",
				name: "Backlog",
				order: 2,
				deleted_at: null,
				created_at: "2024-06-01T00:00:00.000Z",
				updated_at: "2024-06-02T00:00:00.000Z",
				entity_type: "SECTION",
			};

			const result = mapper.toDomain(dbEntity);

			expect(result).toEqual({
				id: "s-1",
				userId: "u-1",
				projectId: "p-1",
				name: "Backlog",
				order: 2,
				deletedAt: null,
				createdAt: "2024-06-01T00:00:00.000Z",
				updatedAt: "2024-06-02T00:00:00.000Z",
			});
		});

		it("should handle soft-deleted section", () => {
			const dbEntity: SectionDynamoDBEntity = {
				PK: "USER#u-1#PROJECT#p-1",
				SK: "SECTION#s-1",
				id: "s-1",
				user_id: "u-1",
				project_id: "p-1",
				name: "Done",
				order: 0,
				deleted_at: "2024-07-01T00:00:00.000Z",
				created_at: "2024-06-01T00:00:00.000Z",
				updated_at: "2024-06-01T00:00:00.000Z",
				entity_type: "SECTION",
			};

			const result = mapper.toDomain(dbEntity);

			expect(result.deletedAt).toBe("2024-07-01T00:00:00.000Z");
		});
	});

	describe("toDatabase", () => {
		it("should build correct PK and SK", () => {
			const section = buildSection({
				userId: "u-1",
				projectId: "p-1",
				id: "s-1",
			});
			const result = mapper.toDatabase(section);

			expect(result.PK).toBe("USER#u-1#PROJECT#p-1");
			expect(result.SK).toBe("SECTION#s-1");
		});

		it("should set entity_type to SECTION", () => {
			const section = buildSection();
			const result = mapper.toDatabase(section);

			expect(result.entity_type).toBe("SECTION");
		});

		it("should convert domain fields to snake_case", () => {
			const section = buildSection({
				userId: "u-1",
				projectId: "p-1",
				name: "In Progress",
				order: 3,
			});

			const result = mapper.toDatabase(section);

			expect(result.user_id).toBe("u-1");
			expect(result.project_id).toBe("p-1");
			expect(result.name).toBe("In Progress");
			expect(result.order).toBe(3);
		});
	});

	describe("roundtrip", () => {
		it("should preserve data through toDomain(toDatabase(section))", () => {
			const original = buildSection({
				id: "s-1",
				userId: "u-1",
				projectId: "p-1",
				name: "Backlog",
				order: 1,
				createdAt: "2024-06-01T00:00:00.000Z",
				updatedAt: "2024-06-01T00:00:00.000Z",
			});

			const dbEntity = mapper.toDatabase(original);
			const result = mapper.toDomain(dbEntity);

			expect(result.id).toBe(original.id);
			expect(result.userId).toBe(original.userId);
			expect(result.projectId).toBe(original.projectId);
			expect(result.name).toBe(original.name);
			expect(result.order).toBe(original.order);
		});
	});
});
