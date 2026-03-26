import { buildTask } from "@test/builders";
import { buildTaskDynamoEntity } from "@test/builders";
import { TasksDynamoMapper } from "./task-mapper";

describe("TasksDynamoMapper", () => {
	const mapper = new TasksDynamoMapper();

	describe("toDomain", () => {
		it("should convert snake_case DynamoDB entity to camelCase domain entity", () => {
			const dbEntity = buildTaskDynamoEntity({
				id: "t-1",
				user_id: "u-1",
				project_id: "p-1",
				section_id: "s-1",
				title: "My task",
				description: "desc",
				completed: false,
				order: 3,
				created_at: "2024-06-01T10:00:00.000Z",
				updated_at: "2024-06-02T10:00:00.000Z",
				completed_at: null,
				due_date: "2024-06-15T00:00:00.000Z",
				priority: "high",
			});

			const result = mapper.toDomain(dbEntity);

			expect(result).toEqual({
				id: "t-1",
				userId: "u-1",
				projectId: "p-1",
				sectionId: "s-1",
				title: "My task",
				description: "desc",
				completed: false,
				order: 3,
				createdAt: "2024-06-01T10:00:00.000Z",
				updatedAt: "2024-06-02T10:00:00.000Z",
				completedAt: null,
				dueDate: "2024-06-15T00:00:00.000Z",
				priority: "high",
			});
		});

		it("should handle null optional fields", () => {
			const dbEntity = buildTaskDynamoEntity({
				project_id: null,
				section_id: null,
				completed_at: null,
				due_date: null,
				priority: null,
			});

			const result = mapper.toDomain(dbEntity);

			expect(result.projectId).toBeNull();
			expect(result.sectionId).toBeNull();
			expect(result.completedAt).toBeNull();
			expect(result.dueDate).toBeNull();
			expect(result.priority).toBeNull();
		});

		it("should convert completedAt when present", () => {
			const dbEntity = buildTaskDynamoEntity({
				completed: true,
				completed_at: "2024-06-10T15:30:00.000Z",
			});

			const result = mapper.toDomain(dbEntity);

			expect(result.completedAt).toBe("2024-06-10T15:30:00.000Z");
		});
	});

	describe("toDatabase", () => {
		it("should build inbox PK for task without projectId", () => {
			const task = buildTask({ userId: "u-1", projectId: null });
			const result = mapper.toDatabase(task);

			expect(result.PK).toBe("USER#u-1");
		});

		it("should build project PK for task with projectId", () => {
			const task = buildTask({ userId: "u-1", projectId: "p-1" });
			const result = mapper.toDatabase(task);

			expect(result.PK).toBe("USER#u-1#PROJECT#p-1");
		});

		it("should build inbox pending SK for uncompleted inbox task", () => {
			const task = buildTask({
				projectId: null,
				completed: false,
				order: 5,
				id: "t-1",
			});
			const result = mapper.toDatabase(task);

			expect(result.SK).toBe("TASK#INBOX#PENDING#5#t-1");
		});

		it("should build inbox completed SK for completed inbox task", () => {
			const task = buildTask({
				projectId: null,
				completed: true,
				completedAt: "2024-06-10T15:30:00.000Z",
				id: "t-1",
			});
			const result = mapper.toDatabase(task);

			expect(result.SK).toBe(
				"TASK#INBOX#COMPLETED#2024-06-10T15:30:00.000Z#t-1",
			);
		});

		it("should build project pending SK for uncompleted project task", () => {
			const task = buildTask({
				projectId: "p-1",
				completed: false,
				order: 2,
				id: "t-1",
			});
			const result = mapper.toDatabase(task);

			expect(result.SK).toBe("TASK#PENDING#2#t-1");
		});

		it("should build project completed SK for completed project task", () => {
			const task = buildTask({
				projectId: "p-1",
				completed: true,
				completedAt: "2024-06-10T15:30:00.000Z",
				id: "t-1",
			});
			const result = mapper.toDatabase(task);

			expect(result.SK).toBe("TASK#COMPLETED#2024-06-10T15:30:00.000Z#t-1");
		});

		it("should convert domain fields to snake_case", () => {
			const task = buildTask({
				userId: "u-1",
				projectId: "p-1",
				sectionId: "s-1",
				title: "My task",
				description: "desc",
			});

			const result = mapper.toDatabase(task);

			expect(result.user_id).toBe("u-1");
			expect(result.project_id).toBe("p-1");
			expect(result.section_id).toBe("s-1");
			expect(result.title).toBe("My task");
			expect(result.description).toBe("desc");
			expect(result.entity_type).toBe("TASK");
		});

		it("should default order to 0 in SK when not provided", () => {
			const task = buildTask({
				projectId: null,
				completed: false,
				order: undefined,
				id: "t-1",
			});
			const result = mapper.toDatabase(task);

			expect(result.SK).toBe("TASK#INBOX#PENDING#0#t-1");
		});

		it("should build GSI1PK without date for task with dueDate", () => {
			const task = buildTask({
				userId: "u-1",
				dueDate: "2024-06-15T00:00:00.000Z",
			});
			const result = mapper.toDatabase(task);

			expect(result.GSI1PK).toBe("USER#u-1#DUE_DATE#");
		});

		it("should include date in GSI1SK for pending task", () => {
			const task = buildTask({
				userId: "u-1",
				dueDate: "2024-06-15T00:00:00.000Z",
				priority: "high",
				id: "t-1",
				completed: false,
			});
			const result = mapper.toDatabase(task);

			expect(result.GSI1SK).toBe("2024-06-15#TASK#PENDING#high#t-1");
		});

		it("should include date in GSI1SK for completed task", () => {
			const task = buildTask({
				userId: "u-1",
				dueDate: "2024-06-15T00:00:00.000Z",
				id: "t-1",
				completed: true,
				completedAt: "2024-06-16T10:00:00.000Z",
			});
			const result = mapper.toDatabase(task);

			expect(result.GSI1SK).toBe(
				"2024-06-15#TASK#COMPLETED#2024-06-16T10:00:00.000Z#t-1",
			);
		});

		it("should not set GSI1 for task without dueDate", () => {
			const task = buildTask({ dueDate: null });
			const result = mapper.toDatabase(task);

			expect(result.GSI1PK).toBeUndefined();
			expect(result.GSI1SK).toBeUndefined();
		});
	});

	describe("roundtrip", () => {
		it("should preserve data through toDomain(toDatabase(task))", () => {
			const original = buildTask({
				id: "t-1",
				userId: "u-1",
				projectId: null,
				sectionId: null,
				title: "Roundtrip",
				description: "test",
				completed: false,
				order: 1,
				createdAt: "2024-06-01T00:00:00.000Z",
				updatedAt: "2024-06-01T00:00:00.000Z",
				completedAt: null,
				dueDate: null,
				priority: "medium",
			});

			const dbEntity = mapper.toDatabase(original);
			const result = mapper.toDomain(dbEntity);

			expect(result.id).toBe(original.id);
			expect(result.userId).toBe(original.userId);
			expect(result.projectId).toBe(original.projectId);
			expect(result.sectionId).toBe(original.sectionId);
			expect(result.title).toBe(original.title);
			expect(result.description).toBe(original.description);
			expect(result.completed).toBe(original.completed);
			expect(result.order).toBe(original.order);
			expect(result.completedAt).toBe(original.completedAt);
			expect(result.priority).toBe(original.priority);
		});

		it("should preserve data for completed project task with dueDate", () => {
			const original = buildTask({
				id: "t-2",
				userId: "u-1",
				projectId: "p-1",
				sectionId: "s-1",
				completed: true,
				completedAt: "2024-06-10T15:30:00.000Z",
				dueDate: "2024-06-15T00:00:00.000Z",
				priority: "high",
			});

			const dbEntity = mapper.toDatabase(original);
			const result = mapper.toDomain(dbEntity);

			expect(result.id).toBe(original.id);
			expect(result.projectId).toBe(original.projectId);
			expect(result.sectionId).toBe(original.sectionId);
			expect(result.completed).toBe(original.completed);
			expect(result.completedAt).toBe(original.completedAt);
			expect(result.priority).toBe(original.priority);
		});
	});
});
