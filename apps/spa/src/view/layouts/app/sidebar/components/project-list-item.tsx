import {
	AlertCircle,
	Copy,
	Eye,
	Frame,
	History,
	Link2,
	Loader2,
	MoreHorizontal,
	Share,
	Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { Project } from "@/modules/projects/app/entitites/project";
import type { WithOptimisticState } from "@/utils/types";
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
}

export function ProjectListItem(props: ProjectListItemProps) {
	const { project } = props;
	const { isMobile } = useSidebar();

	const isPending = project.optimisticState === "pending";
	const isError = project.optimisticState === "error";
	const shouldShowDropdown =
		project.optimisticState === "synced" || !project.optimisticState;

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
							<DropdownMenuItem>
								<Eye className="text-muted-foreground" />
								<span>View Project</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Copy className="text-muted-foreground" />
								<span>Duplicate Project</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link2 className="text-muted-foreground" />
								<span>Copy link to Project</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<History className="text-muted-foreground" />
								<span>Activity Log</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Share className="text-muted-foreground" />
								<span>Share Project</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Trash2 className="text-muted-foreground" />
								<span>Delete Project</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				}
			/>
		</SidebarMenuItem>
	);
}
