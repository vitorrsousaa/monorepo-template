import { ProjectNotFound } from "@application/modules/projects/errors/project-not-found";
import { buildBoardAccess, buildMember, buildProject } from "@test/builders";
import {
	mockPermissionService,
	mockProjectsRepository,
	mockSharingRepository,
} from "@test/mocks";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemberNotFoundError } from "../../errors/member-not-found";
import { UpdateMemberRoleService } from "./service";

describe("UpdateMemberRoleService", () => {
	const permissionService = mockPermissionService();
	const sharingRepo = mockSharingRepository();
	const projectRepo = mockProjectsRepository();
	const sut = new UpdateMemberRoleService(
		permissionService,
		sharingRepo,
		projectRepo,
	);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should update member role successfully", async () => {
		const member = buildMember({ userId: "user-002", role: "viewer" });
		const project = buildProject({
			id: "project-001",
			userId: "user-001",
			members: [member],
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
		vi.mocked(sharingRepo.updateMemberRole).mockResolvedValue(undefined);

		await sut.execute({
			userId: "user-001",
			projectId: "project-001",
			memberId: "user-002",
			role: "editor",
		});

		expect(sharingRepo.updateMemberRole).toHaveBeenCalledWith({
			boardAccess,
			newRole: "editor",
			project,
			updatedMembers: [{ ...member, role: "editor" }],
		});
	});

	it("should call permissionService.requireRole with owner role", async () => {
		vi.mocked(permissionService.requireRole).mockResolvedValue({
			ownerUserId: "user-001",
			effectiveRole: "owner",
		});
		vi.mocked(sharingRepo.getBoardAccess).mockResolvedValue(buildBoardAccess());
		vi.mocked(projectRepo.getById).mockResolvedValue(buildProject());
		vi.mocked(sharingRepo.updateMemberRole).mockResolvedValue(undefined);

		await sut.execute({
			userId: "user-001",
			projectId: "project-001",
			memberId: "user-002",
			role: "viewer",
		});

		expect(permissionService.requireRole).toHaveBeenCalledWith({
			requesterId: "user-001",
			resourceType: "project",
			resourceId: "project-001",
			requiredRole: "owner",
		});
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
				role: "viewer",
			}),
		).rejects.toThrow(new MemberNotFoundError());
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
				role: "viewer",
			}),
		).rejects.toThrow(new ProjectNotFound());
	});
});
