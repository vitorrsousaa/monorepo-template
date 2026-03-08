import { Link } from "react-router-dom";

import { useGetAllProjectsByUser } from "@/modules/projects/app/hooks/use-get-all-projects-by-user";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { FolderPlus, Frame, Loader2, Plus } from "lucide-react";
import { NewProjectModal } from "@/modules/projects/view/modals/new-project-modal";
import { useReducer } from "react";
import { RenderIf } from "@repo/ui/render-if";

export function AllProjects() {
	const { projects, isErrorProjects, isFetchingProjects, refetchProjects } =
		useGetAllProjectsByUser();
	const [isNewProjectModalOpen, toggleNewProjectModal] = useReducer(
		(state) => !state,
		false,
	);

	if (isFetchingProjects) {
		return (
			<div className="flex h-full items-center justify-center p-8">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (isErrorProjects) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 p-8">
				<p className="text-muted-foreground">Failed to load projects</p>
				<Button variant="outline" onClick={() => refetchProjects()}>
					Retry
				</Button>
			</div>
		);
	}

	const hasProjects = projects.length > 0;

	return (
		<div className="h-full w-full flex flex-col bg-background overflow-hidden">
			<div className="flex-shrink-0 border-b border-border px-8 py-6">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-semibold">All Projects</h1>
					<Button onClick={toggleNewProjectModal}>
						<FolderPlus className="w-4 h-4 mr-2" />
						New Project
					</Button>
				</div>
			</div>

			<div className="flex-1 min-h-0 overflow-y-auto">
				<div className="p-8">
					<RenderIf
						condition={!hasProjects}
						render={
							<div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
								<div className="rounded-lg bg-muted/50 p-6">
									<FolderPlus className="h-12 w-12 text-muted-foreground" />
								</div>
								<div className="space-y-1">
									<p className="font-medium">No projects yet</p>
									<p className="text-sm text-muted-foreground">
										Create your first project to get started
									</p>
								</div>
								<Button onClick={toggleNewProjectModal}>
									<Plus className="h-4 w-4 mr-2" />
									New Project
								</Button>
							</div>
						}
					/>

					<RenderIf
						condition={hasProjects}
						render={
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{projects.map((project) => (
									<Link key={project.id} to={`/projects/${project.id}`}>
										<Card className="p-4 transition-colors hover:bg-muted/50">
											<div className="flex items-center gap-3">
												<div className="rounded-lg bg-muted p-2">
													<Frame className="h-5 w-5 text-muted-foreground" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="font-medium truncate">{project.name}</p>
													{project.description && (
														<p className="text-sm text-muted-foreground truncate">
															{project.description}
														</p>
													)}
												</div>
											</div>
										</Card>
									</Link>
								))}
							</div>
						}
					/>
				</div>
			</div>

			<NewProjectModal
				isOpen={isNewProjectModalOpen}
				onClose={toggleNewProjectModal}
			/>
		</div>
	);
}
