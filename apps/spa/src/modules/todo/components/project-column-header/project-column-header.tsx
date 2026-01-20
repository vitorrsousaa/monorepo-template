import type { Project } from "@/pages/app/todo/today";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Info, MoreVertical } from "lucide-react";

export interface ProjectColumnHeaderProps {
	project: Project;
	onViewProjectDetails: (projectId: string) => void;
	onDeleteProject: (project: Project) => void;
}

export const ProjectColumnHeader = (props: ProjectColumnHeaderProps) => {
	const { project, onViewProjectDetails, onDeleteProject } = props;

	const getTodoCountText = (count: number) => {
		return `${count}`;
	};

	return (
		<div className="flex items-center justify-between mb-4 flex-shrink-0">
			<div className="flex items-center gap-2">
				<h2 className="font-semibold">{project.name}</h2>
				<Badge variant="secondary" className="rounded-full px-2">
					{getTodoCountText(project.todos.length)}
				</Badge>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="h-8 w-8">
						<MoreVertical className="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={(e) => {
							e.stopPropagation();
							onViewProjectDetails(project.id);
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
							onDeleteProject(project);
						}}
					>
						Delete Project
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
