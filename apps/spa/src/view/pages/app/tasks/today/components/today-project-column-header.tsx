import { PROJECT_INBOX_ID } from "@/config/constants";
import { ROUTES } from "@/config/routes";
import { DeleteProjectModal } from "@/modules/todo/view/modals/delete-project-modal";
import type { TodayProjectDto } from "@repo/contracts/tasks/today";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { RenderIf } from "@repo/ui/render-if";
import { Info, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TodayProjectColumnHeaderProps {
	project: TodayProjectDto;
}

export const TodayProjectColumnHeader = (
	props: TodayProjectColumnHeaderProps,
) => {
	const { project } = props;

	const navigate = useNavigate();

	const [deleteProjectModal, setDeleteProjectModal] = useState<{
		isOpen: boolean;
		project: TodayProjectDto | null;
	}>({
		isOpen: false,
		project: null,
	});

	const confirmDeleteProject = () => {
		setDeleteProjectModal({ isOpen: false, project: null });
	};

	const handleViewProjectDetails = (projectId: string) => {
		navigate(ROUTES.PROJECTS.PROJECT_DETAILS.replace(":id", projectId));
	};

	const getTodoCountText = (count: number) => {
		return `${count}`;
	};

	return (
		<div className="flex items-center justify-between flex-shrink-0">
			<div className="flex items-center gap-2">
				<h2 className="font-semibold">{project.name}</h2>
				<Badge variant="secondary" className="rounded-full px-2">
					{getTodoCountText(project.tasks.length)}
				</Badge>
			</div>
			<RenderIf
				condition={project.id !== PROJECT_INBOX_ID}
				render={
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-6 w-6">
								<MoreVertical className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation();
									handleViewProjectDetails(project.id);
								}}
							>
								<Info className="w-4 h-4 mr-2" />
								Project Details
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive"
								onClick={(e) => {
									e.stopPropagation();
									setDeleteProjectModal({ isOpen: true, project });
									e.preventDefault();
								}}
							>
								Delete Project
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				}
			/>

			<DeleteProjectModal
				isOpen={deleteProjectModal.isOpen}
				onClose={() => setDeleteProjectModal({ isOpen: false, project: null })}
				projectName={deleteProjectModal.project?.name || ""}
				onConfirm={confirmDeleteProject}
			/>
		</div>
	);
};
