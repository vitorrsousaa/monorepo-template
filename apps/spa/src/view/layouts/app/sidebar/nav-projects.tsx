import { FolderOpen, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/config/routes";
import { ProjectListEmptyState } from "@/layouts/app/sidebar/components/project-list-empty-state";
import { ProjectListError } from "@/layouts/app/sidebar/components/project-list-error";
import { ProjectListSkeleton } from "@/layouts/app/sidebar/components/project-list-skeleton";
import { useGetAllProjectsByUser } from "@/modules/projects/app/hooks/use-get-all-projects-by-user";
import { Button } from "@repo/ui/button";
import { RenderIf } from "@repo/ui/render-if";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/sidebar";
import { ProjectListItem } from "./components/project-list-item";

export function NavProjects() {
	const { projects, isErrorProjects, isFetchingProjects, refetchProjects } =
		useGetAllProjectsByUser();

	const hasProjects = projects.length > 0;
	const shouldRenderProjects =
		!isFetchingProjects && !isErrorProjects && hasProjects;
	const shouldRenderEmptyState =
		!isFetchingProjects && !isErrorProjects && !hasProjects;

	const displayedProjects = projects.slice(0, 4);
	const remainingCount = projects.length - 4;
	const hasMoreProjects = remainingCount > 0;

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>
				Projects{" "}
				<Button variant="ghost" size="icon">
					<Plus className="w-4 h-4" />
				</Button>
			</SidebarGroupLabel>

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
							{displayedProjects.map((item) => (
								<ProjectListItem
									key={`project-list-item-${item.id}-${Math.random().toString(36).substring(2, 15)}`}
									project={item}
								/>
							))}
							<RenderIf
								condition={hasMoreProjects}
								render={
									<SidebarMenuItem>
										<SidebarMenuButton asChild>
											<Link
												to={ROUTES.PROJECTS.LIST}
												className="text-sidebar-foreground/70"
											>
												<FolderOpen />
												<span>+{remainingCount} project</span>
												<span className="sr-only">
													View all {projects.length} projects
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								}
							/>
						</>
					}
				/>
			</SidebarMenu>
		</SidebarGroup>
	);
}
