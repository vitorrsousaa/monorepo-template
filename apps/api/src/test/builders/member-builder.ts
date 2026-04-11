import type { Member } from "@core/domain/sharing/member";

const defaults: Member = {
	userId: "user-002",
	name: "Guest User",
	email: "guest@example.com",
	role: "editor",
	joinedAt: "2024-01-01T00:00:00.000Z",
};

export function buildMember(overrides?: Partial<Member>): Member {
	return { ...defaults, ...overrides };
}
