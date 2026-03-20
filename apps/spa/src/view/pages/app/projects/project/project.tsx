import { ProjectSection } from "@/modules/projects/view/components/project-section";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { GripVertical, Plus } from "lucide-react";
import { ProjectErrorState } from "./components/project-error-state";
import { ProjectHeader } from "./components/project-header";
import { ProjectLoadingSkeleton } from "./components/project-loading-skeleton";
import { ProjectTopbar } from "./components/project-topbar";
import { useProjectHook } from "./project.hook";

export function Projects() {
	const {
		projectDetail,
		isErrorProjectDetail,
		isFetchingProjectDetail,
		openInputToAddSection,
		newSectionName,
		refetchProjectDetail,
		handleAddSection,
		toggleInputToAddSection,
		handleCloseInputToAddSection,
		handleKeyDownInputToAddSection,
		handleChangeInputToAddSection,
	} = useProjectHook();

	if (isFetchingProjectDetail) {
		return <ProjectLoadingSkeleton />;
	}

	if (isErrorProjectDetail) {
		return (
			<div className="p-8">
				<ProjectErrorState onRetry={() => refetchProjectDetail()} />
			</div>
		);
	}

	if (!projectDetail) {
		return (
			<div className="p-8">
				<div className="text-center text-muted-foreground">
					Project not found
				</div>
			</div>
		);
	}

	const { project, sections } = projectDetail;
	const allTasks = [
		...sections.flatMap((s) => s.tasks),
	];
	const completedCount = allTasks.filter((t) => t.completed).length;
	const totalCount = allTasks.length;

	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-background">
			<ProjectTopbar
				projectName={project.name}
				projectId={project.id}

			/>

			<div className="flex-1 min-h-0 overflow-y-auto">
				<div className="mx-auto max-w-[740px] px-8 pb-20 pt-8">
					<ProjectHeader
						name={project.name}
						description={project.description}
						completedCount={completedCount}
						totalCount={totalCount}
						deadlineLabel={null}
						statusLabel="Active"
					/>

					{/* Sections */}
					{sections.map((section) => (
						<ProjectSection
							key={section.id}
							section={section}
							projectId={project.id}
							projectName={project.name}
						/>
					))}

					{/* Add section */}
					{openInputToAddSection ? (
						<div className="flex items-center gap-2 py-2.5">
							<GripVertical className="h-4 w-4 text-muted-foreground" />
							<Input
								value={newSectionName}
								onChange={handleChangeInputToAddSection}
								placeholder="Section name"
								className="h-9"
								autoFocus
								onKeyDown={handleKeyDownInputToAddSection}
							/>
							<Button size="sm" onClick={handleAddSection}>
								Add
							</Button>
							<Button
								size="sm"
								variant="ghost"
								onClick={handleCloseInputToAddSection}
							>
								Cancel
							</Button>
						</div>
					) : (
						<button
							type="button"
							className="flex items-center gap-2 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
							onClick={toggleInputToAddSection}
						>
							<Plus className="h-3.5 w-3.5" />
							Add section
						</button>
					)}
				</div>
			</div>


		</div>
	);
}