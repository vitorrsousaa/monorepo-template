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

import { useGetAllProjectsByUser } from "@/modules/projects/app/hooks/use-get-all-projects-by-user";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { RenderIf } from "@repo/ui/render-if";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@repo/ui/sidebar";
import { ProjectListEmptyState } from "./components/project-list-empty-state";
import { ProjectListError } from "./components/project-list-error";
import { ProjectListSkeleton } from "./components/project-list-skeleton";

export function NavProjects() {
	const { isMobile } = useSidebar();

	const { projects, isErrorProjects, isFetchingProjects, refetchProjects } =
		useGetAllProjectsByUser();

	const hasProjects = projects.length > 0;
	const shouldRenderProjects =
		!isFetchingProjects && !isErrorProjects && hasProjects;
	const shouldRenderEmptyState =
		!isFetchingProjects && !isErrorProjects && !hasProjects;

	// ROUTES.TODO.PROJECTS.replace(":id", "1")

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Projects</SidebarGroupLabel>
			<SidebarMenu>
				{/* Loading State */}
				<RenderIf
					condition={isFetchingProjects}
					render={<ProjectListSkeleton />}
				/>

				{/* Error State */}
				<RenderIf
					condition={isErrorProjects}
					render={<ProjectListError onRetry={refetchProjects} />}
				/>

				{/* Empty State */}
				<RenderIf
					condition={shouldRenderEmptyState}
					render={<ProjectListEmptyState />}
				/>

				{/* Projects List */}
				<RenderIf
					condition={shouldRenderProjects}
					render={
						<>
							{projects.map((item) => (
								<SidebarMenuItem key={item.id}>
									<SidebarMenuButton asChild>
										<a href={`/projects/${item.id}`}>
											<Frame />
											<span>{item.name}</span>
										</a>
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
							))}
							<SidebarMenuItem>
								<SidebarMenuButton className="text-sidebar-foreground/70">
									<MoreHorizontal />
									<span>More</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</>
					}
				/>
			</SidebarMenu>
		</SidebarGroup>
	);
}
