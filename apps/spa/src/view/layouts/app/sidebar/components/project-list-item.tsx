import {
	AlertCircle,
	Eye,
	Frame,
	History,
	Loader2,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import type { Project } from "@/modules/projects/app/entitites/project";
import { DeleteProjectModal } from "@/modules/todo/view/modals/delete-project-modal";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { RenderIf } from "@repo/ui/render-if";
import {
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@repo/ui/sidebar";
import { cn } from "@repo/ui/utils";

interface ProjectListItemProps {
	project: WithOptimisticState<Project>;
	onDeleteProject?: (project: Project) => void;
}

export function ProjectListItem(props: ProjectListItemProps) {
	const { project, onDeleteProject } = props;
	const { isMobile } = useSidebar();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const isPending = project.optimisticState === OptimisticState.PENDING;
	const isError = project.optimisticState === OptimisticState.ERROR;
	const shouldShowDropdown =
		project.optimisticState === OptimisticState.SYNCED ||
		!project.optimisticState;

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				disabled={isPending || isError}
				className={cn(
					(isPending || isError) && "cursor-not-allowed opacity-50",
					isError && "text-destructive opacity-80",
				)}
			>
				<Link to={`/projects/${project.id}`}>
					<Frame />
					<span>{project.name}</span>
				</Link>
			</SidebarMenuButton>

			{/* Pending: Loading spinner */}
			<RenderIf
				condition={isPending}
				render={
					<SidebarMenuAction>
						<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
						<span className="sr-only">Saving...</span>
					</SidebarMenuAction>
				}
			/>

			{/* Error: Alert icon sempre visível */}
			<RenderIf
				condition={isError}
				render={
					<SidebarMenuAction>
						<AlertCircle className="h-4 w-4 text-destructive" />
						<span className="sr-only">Error</span>
					</SidebarMenuAction>
				}
			/>

			{/* Synced ou sem status: Dropdown normal */}
			<RenderIf
				condition={shouldShowDropdown}
				render={
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuAction showOnHover>
								<MoreHorizontal />
								<span className="sr-only">More</span>
							</SidebarMenuAction>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-48"
							side={isMobile ? "bottom" : "right"}
							align={isMobile ? "end" : "start"}
						>
							<DropdownMenuItem asChild>
								<Link to={`/projects/${project.id}`}>
									<Eye className="text-muted-foreground" />
									<span>View Project</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<History className="text-muted-foreground" />
								<span>Activity Log</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onSelect={() => setIsDeleteModalOpen(true)}>
								<Trash2 className="text-muted-foreground" />
								<span>Delete Project</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				}
			/>

			<DeleteProjectModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				projectName={project.name}
				onConfirm={() => onDeleteProject?.(project)}
			/>
		</SidebarMenuItem>
	);
}
