import { useToggle } from "@/hooks/toggle";
import { useGetProjectMembers } from "@/modules/sharing/app/hooks/use-get-project-members";
import { Button } from "@repo/ui/button";
import { Dialog, DialogContent } from "@repo/ui/dialog";
import { Plus, X } from "lucide-react";
import { useGetProjectDetail } from "../../app/hooks/use-get-project-detail";
import { ProjectMembersSettingsPendingInvitations } from "../components/project-members-settings-pending-invitations";
import { InviteProjectMemberModal } from "./invite-project-member-modal";

interface ProjectMembersSettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: string;
}

export function ProjectMembersSettingsModal(
	props: ProjectMembersSettingsModalProps,
) {
	const { isOpen, onClose, projectId } = props;

	const [
		isOpenInviteProjectMemberModalOpen,
		toggleIsOpenInviteProjectMemberModalOpen,
	] = useToggle(false);

	const { projectDetail } = useGetProjectDetail({
		projectId,
		enabled: isOpen,
	});

	const { members } = useGetProjectMembers({
		projectId,
		enabled: isOpen,
	});

	if (!projectDetail) return null;

	const { project } = projectDetail;

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent
					className="sm:max-w-[500px] overflow-hidden border-none bg-card p-0"
					hideDefaultClose
				>
					<div
						className="h-1 w-full"
						style={{ backgroundColor: project.color }}
					/>

					<div className="space-y-6 px-7 pb-6">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2 className="text-[17px] font-semibold tracking-tight text-foreground">
									Members
								</h2>
								<p className="mt-1 text-xs text-muted-foreground">
									{project.name} | {members.length} members
								</p>
							</div>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={onClose}
							>
								<X className="h-3.5 w-3.5" />
							</Button>
						</div>

						<section
							className="flex flex-col gap-3 rounded-[14px] border border-solid p-3 px-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
							style={{
								backgroundColor: `${project.color}22`,
								borderColor: `${project.color}40`,
							}}
						>
							<div className="min-w-0 space-y-0.5">
								<p
									className="text-xs font-medium"
									style={{ color: project.color }}
								>
									Invite someone to collaborate
								</p>
								<p className="text-[11px] text-foreground/70">
									They'll receive an email invitation to join this project
								</p>
							</div>
							<Button
								type="button"
								size="sm"
								className="shrink-0 whitespace-nowrap border-0 text-white shadow-none hover:opacity-90 [&_svg]:size-[11px]"
								style={{ backgroundColor: project.color }}
								onClick={toggleIsOpenInviteProjectMemberModalOpen}
							>
								<Plus className="size-[11px] shrink-0" aria-hidden />
								Invite member
							</Button>
						</section>

						<div className="-mx-7 h-px bg-border/60" />

						<ProjectMembersSettingsPendingInvitations projectId={projectId} />
					</div>
				</DialogContent>
			</Dialog>

			<InviteProjectMemberModal
				isOpen={isOpenInviteProjectMemberModalOpen}
				onClose={toggleIsOpenInviteProjectMemberModalOpen}
				projectId={projectId}
			/>
		</>
	);
}
