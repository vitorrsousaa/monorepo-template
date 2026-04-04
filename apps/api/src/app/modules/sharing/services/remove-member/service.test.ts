import { AppError } from "@application/errors/app-error";
import { ProjectNotFound } from "@application/modules/projects/errors/project-not-found";
import { buildBoardAccess, buildMember, buildProject } from "@test/builders";
import {
	mockPermissionService,
	mockProjectsRepository,
	mockSharingRepository,
} from "@test/mocks";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RemoveMemberService } from "./service";

describe("RemoveMemberService", () => {
	const permissionService = mockPermissionService();
	const sharingRepo = mockSharingRepository();
	const projectRepo = mockProjectsRepository();
	const sut = new RemoveMemberService(
		permissionService,
		sharingRepo,
		projectRepo,
	);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should remove member successfully (owner removing another member)", async () => {
		const memberToRemove = buildMember({ userId: "user-002" });
		const anotherMember = buildMember({ userId: "user-003" });
		const project = buildProject({
			id: "project-001",
			userId: "user-001",
			members: [memberToRemove, anotherMember],
		});
		const boardAccess = buildBoardAccess({
			guestUserId: "user-002",
			resourceId: "project-001",
			ownerUserId: "user-001",
		});

		vi.mocked(permissionService.requireRole).mockResolvedValue({
			ownerUserId: "user-001",
			effectiveRole: "owner",
		});
		vi.mocked(sharingRepo.getBoardAccess).mockResolvedValue(boardAccess);
		vi.mocked(projectRepo.getById).mockResolvedValue(project);
		vi.mocked(sharingRepo.removeMember).mockResolvedValue(undefined);

		await sut.execute({
			userId: "user-001",
			projectId: "project-001",
			memberId: "user-002",
		});

		expect(sharingRepo.removeMember).toHaveBeenCalledWith({
			boardAccess,
			project,
			updatedMembers: [anotherMember],
		});
	});

	it("should allow self-removal (viewer requiring viewer role)", async () => {
		const member = buildMember({ userId: "user-002", role: "viewer" });
		const project = buildProject({
			id: "project-001",
			userId: "user-001",
			members: [member],
		});
		const boardAccess = buildBoardAccess({
			guestUserId: "user-002",
			ownerUserId: "user-001",
		});

		vi.mocked(permissionService.requireRole).mockResolvedValue({
			ownerUserId: "user-001",
			effectiveRole: "viewer",
		});
		vi.mocked(sharingRepo.getBoardAccess).mockResolvedValue(boardAccess);
		vi.mocked(projectRepo.getById).mockResolvedValue(project);
		vi.mocked(sharingRepo.removeMember).mockResolvedValue(undefined);

		await sut.execute({
			userId: "user-002",
			projectId: "project-001",
			memberId: "user-002",
		});

		expect(permissionService.requireRole).toHaveBeenCalledWith(
			expect.objectContaining({ requiredRole: "viewer" }),
		);
		expect(sharingRepo.removeMember).toHaveBeenCalledWith({
			boardAccess,
			project,
			updatedMembers: [],
		});
	});

	it("should require owner role when removing another member", async () => {
		vi.mocked(permissionService.requireRole).mockResolvedValue({
			ownerUserId: "user-001",
			effectiveRole: "owner",
		});
		vi.mocked(sharingRepo.getBoardAccess).mockResolvedValue(buildBoardAccess());
		vi.mocked(projectRepo.getById).mockResolvedValue(buildProject());
		vi.mocked(sharingRepo.removeMember).mockResolvedValue(undefined);

		await sut.execute({
			userId: "user-001",
			projectId: "project-001",
			memberId: "user-002",
		});

		expect(permissionService.requireRole).toHaveBeenCalledWith(
			expect.objectContaining({ requiredRole: "owner" }),
		);
	});

	it("should throw 404 when board access not found", async () => {
		vi.mocked(permissionService.requireRole).mockResolvedValue({
			ownerUserId: "user-001",
			effectiveRole: "owner",
		});
		vi.mocked(sharingRepo.getBoardAccess).mockResolvedValue(null);

		await expect(
			sut.execute({
				userId: "user-001",
				projectId: "project-001",
				memberId: "user-002",
			}),
		).rejects.toThrow(new AppError("Member not found", 404));
	});

	it("should throw 404 when project not found", async () => {
		vi.mocked(permissionService.requireRole).mockResolvedValue({
			ownerUserId: "user-001",
			effectiveRole: "owner",
		});
		vi.mocked(sharingRepo.getBoardAccess).mockResolvedValue(buildBoardAccess());
		vi.mocked(projectRepo.getById).mockResolvedValue(null);

		await expect(
			sut.execute({
				userId: "user-001",
				projectId: "project-001",
				memberId: "user-002",
			}),
		).rejects.toThrow(new ProjectNotFound());
	});
});
