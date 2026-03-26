import {
	Eye,
	History,
	Loader2,
	MoreHorizontal,
	RotateCw,
	Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { useCreateProject } from "@/modules/projects/app/hooks/use-create-project";
import { DeleteProjectModal } from "@/modules/todo/view/modals/delete-project-modal";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";
import type { Project } from "@repo/contracts/projects/entities";
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
	const { retryProject } = useCreateProject();

	const isPendingState = project.optimisticState === OptimisticState.PENDING;
	const isError = project.optimisticState === OptimisticState.ERROR;
	const shouldShowDropdown =
		project.optimisticState === OptimisticState.SYNCED ||
		!project.optimisticState;

	const handleRetry = useCallback(() => {
		retryProject(project.id);
	}, [project.id, retryProject]);

	const isNavigable = !isPendingState && !isError;

	const colorDot = (
		<span
			className="size-2.5 shrink-0 rounded-full border border-sidebar-border/40 ring-1 ring-background"
			style={{ backgroundColor: project.color }}
			aria-hidden
		/>
	);

	return (
		<SidebarMenuItem>
			{isNavigable ? (
				<SidebarMenuButton asChild>
					<Link to={`/projects/${project.id}`}>
						{colorDot}
						<span>{project.name}</span>
					</Link>
				</SidebarMenuButton>
			) : (
				<SidebarMenuButton
					disabled
					className={cn(
						"cursor-not-allowed opacity-50",
						isError && "text-destructive opacity-80",
					)}
				>
					{colorDot}
					<span>{project.name}</span>
				</SidebarMenuButton>
			)}

			{/* Pending: Loading spinner */}
			<RenderIf
				condition={isPendingState}
				render={
					<SidebarMenuAction>
						<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
						<span className="sr-only">Saving...</span>
					</SidebarMenuAction>
				}
			/>

			{/* Error: Inline retry and dismiss actions */}
			<RenderIf
				condition={isError}
				render={
					<SidebarMenuAction onClick={handleRetry} title="Retry">
						<RotateCw className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
						<span className="sr-only">Retry</span>
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
