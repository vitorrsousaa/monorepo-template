import { useGetProjectMembers } from "@/modules/sharing/app/hooks/use-get-project-members";
import { Button } from "@repo/ui/button";
import { Dialog, DialogContent } from "@repo/ui/dialog";
import { X } from "lucide-react";
import { useGetProjectDetail } from "../../app/hooks/use-get-project-detail";

interface ProjectMembersSettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: string;
}

export function ProjectMembersSettingsModal(
	props: ProjectMembersSettingsModalProps,
) {
	const { isOpen, onClose, projectId } = props;

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

	console.log(projectDetail);
	console.log(members);

	return (
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

						<Button type="button" variant="ghost" size="icon" onClick={onClose}>
							<X className="h-3.5 w-3.5" />
						</Button>
					</div>

					<div className="mt-4 gap-2 border-t border-border/60 pt-4">
						Invite someone to collaborate
					</div>

					<div className="mt-4 gap-2 border-t border-border/60 pt-4">
						Pending invites
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
