import {
	Copy,
	Eye,
	Frame,
	History,
	Link2,
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
import {
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@repo/ui/sidebar";

interface ProjectListItemProps {
	project: WithOptimisticState<Project>;
}

export function ProjectListItem(props: ProjectListItemProps) {
	const { project } = props;
	const { isMobile } = useSidebar();

	// ROUTES.TODO.PROJECTS.replace(":id", "1")

	return (
		<>
			<SidebarMenuItem>
				<SidebarMenuButton asChild>
					<Link to={`/projects/${project.id}`}>
						<Frame />
						<span>{project.name}</span>
					</Link>
				</SidebarMenuButton>
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
			</SidebarMenuItem>
		</>
	);
}
