import type { BoardAccess } from "@core/domain/sharing/board-access";

const defaults: BoardAccess = {
	id: "board-access-001",
	resourceType: "project",
	resourceId: "project-001",
	ownerUserId: "user-001",
	guestUserId: "user-002",
	role: "editor",
	invitedAt: "2024-01-01T00:00:00.000Z",
	acceptedAt: "2024-01-01T00:00:00.000Z",
	createdAt: "2024-01-01T00:00:00.000Z",
	updatedAt: "2024-01-01T00:00:00.000Z",
	deletedAt: null,
};

export function buildBoardAccess(
	overrides?: Partial<BoardAccess>,
): BoardAccess {
	return { ...defaults, ...overrides };
}
