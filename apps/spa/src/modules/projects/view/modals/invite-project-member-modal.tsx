import { Button } from "@repo/ui/button";
import { Dialog, DialogContent } from "@repo/ui/dialog";
import { useGetProjectDetail } from "../../app/hooks/use-get-project-detail";
import { ProjectMembersSettingsPendingInvitations } from "../components/project-members-settings-pending-invitations";

interface InviteProjectMemberModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: string;
}

export function InviteProjectMemberModal({
	isOpen,
	onClose,
	projectId,
}: InviteProjectMemberModalProps) {
	const { projectDetail } = useGetProjectDetail({
		projectId,
		enabled: isOpen,
	});

	if (!projectDetail) return null;

	const { project } = projectDetail;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px] overflow-hidden border-border bg-card p-0">
				<div className="space-y-6 px-7 pb-6 pt-5">
					<div className="flex items-start justify-between gap-4">
						<div>
							<h2 className="text-[17px] font-semibold tracking-tight text-foreground">
								Invite member
							</h2>
							<p className="mt-1 text-xs text-muted-foreground">
								Send an email invitation to collaborate on this project
							</p>
						</div>
					</div>

					<div className="-mx-7 h-px bg-border/60" />

					<ProjectMembersSettingsPendingInvitations />

					<div className="mt-4 flex justify-end gap-2 border-t border-border/60 pt-4">
						<Button
							type="button"
							variant="outline"
							className="h-9 rounded-lg px-4 text-xs font-medium"
							onClick={onClose}
						>
							Back
						</Button>
						<Button
							type="submit"
							className="h-9 rounded-lg px-5 text-xs font-medium text-white hover:opacity-90"
							style={{ backgroundColor: project.color }}
						>
							Send Invite
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
