import { useToggle } from "@/hooks/toggle";
import { ProjectMembersSettingsModal } from "@/modules/projects/view/modals/project-members-settings";
import { useGetProjectMembers } from "@/modules/sharing/app/hooks/use-get-project-members";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
} from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { RenderIf } from "@repo/ui/render-if";
import { AlertTriangle } from "lucide-react";

interface ProjectMembersButtonProps {
	projectId: string;
}

export function ProjectMembersButton(props: ProjectMembersButtonProps) {
	const { projectId } = props;

	const {
		members,
		isErrorProjectMembers,
		isPendingProjectMembers,
		refetchProjectMembers,
	} = useGetProjectMembers({ projectId });

	const [
		isProjectMembersSettingsModalOpen,
		toggleIsProjectMembersSettingsModalOpen,
	] = useToggle(false);

	if (isErrorProjectMembers) {
		return (
			<Button
				aria-label="Members"
				variant="outline"
				className="h-8 text-muted-foreground hover:text-foreground"
				onClick={() => refetchProjectMembers()}
			>
				<AlertTriangle className="h-3.5 w-3.5" />
				Alert
			</Button>
		);
	}

	function initialsFromName(name: string) {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("");
	}

	return (
		<>
			<Button
				aria-label="Members"
				variant="outline"
				className="h-8 text-muted-foreground hover:text-foreground"
				loading={isPendingProjectMembers}
				onClick={toggleIsProjectMembersSettingsModalOpen}
			>
				<AvatarGroup className="size-6 shrink-0">
					{members.map((member) => (
						<Avatar key={member.userId} className="size-6 shrink-0">
							{/* <AvatarImage src={member.avatar} alt={member.name} /> */}
							<AvatarFallback>
								{initialsFromName(member.name || member.email)}
							</AvatarFallback>
						</Avatar>
					))}
					<RenderIf
						condition={members.length > 3}
						render={
							<AvatarGroupCount className="size-6 shrink-0">
								+{members.length - 3}
							</AvatarGroupCount>
						}
					/>
				</AvatarGroup>
				Members
			</Button>
			<ProjectMembersSettingsModal
				isOpen={isProjectMembersSettingsModalOpen}
				onClose={toggleIsProjectMembersSettingsModalOpen}
				projectId={projectId}
			/>
		</>
	);
}
