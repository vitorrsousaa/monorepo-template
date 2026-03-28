import { ChevronRight, FolderOpen, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/config/routes";
import { ProjectListEmptyState } from "@/layouts/app/sidebar/components/project-list-empty-state";
import { ProjectListError } from "@/layouts/app/sidebar/components/project-list-error";
import { ProjectListSkeleton } from "@/layouts/app/sidebar/components/project-list-skeleton";
import { useGetAllProjectsByUser } from "@/modules/projects/app/hooks/use-get-all-projects-by-user";
import { NewProjectModal } from "@/modules/projects/view/modals/new-project-modal";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@repo/ui/collapsible";
import { RenderIf } from "@repo/ui/render-if";
import {
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/sidebar";
import { useReducer } from "react";
import { ProjectListItem } from "./components/project-list-item";

export function NavProjects() {
	const { t } = useTranslation();
	const { projects, isErrorProjects, isFetchingProjects, refetchProjects } =
		useGetAllProjectsByUser();

	const [isNewProjectModalOpen, toggleNewProjectModal] = useReducer(
		(state) => !state,
		false,
	);

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
			<Collapsible defaultOpen className="group/collapsible">
				<SidebarGroupLabel asChild>
					<CollapsibleTrigger>
						Projects
						<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
					</CollapsibleTrigger>
				</SidebarGroupLabel>
				<SidebarGroupAction onClick={toggleNewProjectModal} title="New project">
					<Plus />
				</SidebarGroupAction>

				<CollapsibleContent>
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
														<span>{t("sidebar.allProjects")}</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										}
									/>
								</>
							}
						/>

						<NewProjectModal
							isOpen={isNewProjectModalOpen}
							onClose={toggleNewProjectModal}
						/>
					</SidebarMenu>
				</CollapsibleContent>
			</Collapsible>
		</SidebarGroup>
	);
}
