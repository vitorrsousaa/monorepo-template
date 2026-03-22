import { buildProject } from "@test/builders";
import { ProjectDynamoMapper } from "./project-mapper";
import type { ProjectDynamoDBEntity } from "./types";

describe("ProjectDynamoMapper", () => {
	const mapper = new ProjectDynamoMapper();

	describe("toDomain", () => {
		it("should convert DynamoDB entity to domain project", () => {
			const dbEntity: ProjectDynamoDBEntity = {
				PK: "USER#u-1",
				SK: "PROJECT#p-1",
				id: "p-1",
				user_id: "u-1",
				name: "Work",
				color: "#7F77DD",
				description: "Work stuff",
				deleted_at: null,
				created_at: "2024-06-01T00:00:00.000Z",
				updated_at: "2024-06-02T00:00:00.000Z",
				entity_type: "PROJECT",
			};

			const result = mapper.toDomain(dbEntity);

			expect(result).toEqual({
				id: "p-1",
				userId: "u-1",
				name: "Work",
				color: "#7F77DD",
				description: "Work stuff",
				deletedAt: undefined,
				createdAt: "2024-06-01T00:00:00.000Z",
				updatedAt: "2024-06-02T00:00:00.000Z",
			});
		});

		it("should handle soft-deleted project", () => {
			const dbEntity: ProjectDynamoDBEntity = {
				PK: "USER#u-1",
				SK: "PROJECT#p-1",
				id: "p-1",
				user_id: "u-1",
				name: "Archived",
				color: "#000000",
				deleted_at: "2024-07-01T00:00:00.000Z",
				created_at: "2024-06-01T00:00:00.000Z",
				updated_at: "2024-06-01T00:00:00.000Z",
				entity_type: "PROJECT",
			};

			const result = mapper.toDomain(dbEntity);

			expect(result.deletedAt).toBe("2024-07-01T00:00:00.000Z");
		});
	});

	describe("toDatabase", () => {
		it("should build correct PK and SK", () => {
			const project = buildProject({ userId: "u-1", id: "p-1" });
			const result = mapper.toDatabase(project);

			expect(result.PK).toBe("USER#u-1");
			expect(result.SK).toBe("PROJECT#p-1");
		});

		it("should set entity_type to PROJECT", () => {
			const project = buildProject();
			const result = mapper.toDatabase(project);

			expect(result.entity_type).toBe("PROJECT");
		});

		it("should convert domain fields to snake_case", () => {
			const project = buildProject({
				userId: "u-1",
				name: "Work",
				description: "desc",
				color: "#123456",
			});

			const result = mapper.toDatabase(project);

			expect(result.user_id).toBe("u-1");
			expect(result.name).toBe("Work");
			expect(result.description).toBe("desc");
			expect(result.color).toBe("#123456");
		});
	});

	describe("roundtrip", () => {
		it("should preserve data through toDomain(toDatabase(project))", () => {
			const original = buildProject({
				id: "p-1",
				userId: "u-1",
				name: "My Project",
				description: "A project",
				color: "#7F77DD",
				createdAt: "2024-06-01T00:00:00.000Z",
				updatedAt: "2024-06-01T00:00:00.000Z",
			});

			const dbEntity = mapper.toDatabase(original);
			const result = mapper.toDomain(dbEntity);

			expect(result.id).toBe(original.id);
			expect(result.userId).toBe(original.userId);
			expect(result.name).toBe(original.name);
			expect(result.description).toBe(original.description);
			expect(result.color).toBe(original.color);
		});
	});
});
