import type { ISharingRepository } from "@data/protocols/sharing/sharing-repository";

export function mockSharingRepository(
	overrides?: Partial<ISharingRepository>,
): ISharingRepository {
	return {
		getBoardAccess: vi.fn(),
		getAllBoardAccessByGuest: vi.fn(),
		createInvitation: vi.fn(),
		getInvitationByIdAndEmail: vi.fn(),
		getAllInvitationsByEmail: vi.fn(),
		getAllInvitationsByProject: vi.fn(),
		getPendingInvitation: vi.fn(),
		acceptInvitation: vi.fn(),
		declineInvitation: vi.fn(),
		cancelInvitation: vi.fn(),
		updateMemberRole: vi.fn(),
		removeMember: vi.fn(),
		getUserIdByEmail: vi.fn(),
		...overrides,
	};
}
