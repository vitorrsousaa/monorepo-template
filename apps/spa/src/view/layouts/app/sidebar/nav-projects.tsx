import { MoreHorizontal } from "lucide-react";

import { ProjectListEmptyState } from "@/layouts/app/sidebar/components/project-list-empty-state";
import { ProjectListError } from "@/layouts/app/sidebar/components/project-list-error";
import { ProjectListSkeleton } from "@/layouts/app/sidebar/components/project-list-skeleton";
import { useGetAllProjectsByUser } from "@/modules/projects/app/hooks/use-get-all-projects-by-user";
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
								<ProjectListItem
									key={`project-list-item-${item.id}-${Math.random().toString(36).substring(2, 15)}`}
									project={item}
								/>
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
