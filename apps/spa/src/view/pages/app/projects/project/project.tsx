import { useGetProjectDetail } from "@/modules/projects/app/hooks/use-get-project-detail";
import { ProjectSection } from "@/modules/projects/view/components/project-section";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { GripVertical, Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ProjectErrorState } from "./components/project-error-state";
import { ProjectLoadingSkeleton } from "./components/project-loading-skeleton";

export function Projects() {
	const { id } = useParams();
	const projectId = id ?? "";

	const {
		projectDetail,
		isErrorProjectDetail,
		isFetchingProjectDetail,
		refetchProjectDetail,
	} = useGetProjectDetail({ projectId });

	const [isAddingSection, setIsAddingSection] = useState(false);
	const [newSectionName, setNewSectionName] = useState("");

	const handleAddSection = () => {
		if (newSectionName.trim()) {
			setNewSectionName("");
			setIsAddingSection(false);
		}
	};

	// Loading state
	if (isFetchingProjectDetail) {
		return <ProjectLoadingSkeleton />;
	}

	// Error state
	if (isErrorProjectDetail) {
		return (
			<div className="p-8">
				<ProjectErrorState onRetry={() => refetchProjectDetail()} />
			</div>
		);
	}

	// Mock project data (fallback when API projectDetail not used yet)

	if (!projectDetail) {
		return (
			<div className="p-8">
				<div className="text-center text-muted-foreground">
					Project not found
				</div>
			</div>
		);
	}

	// all todos completed in project
	const completedCount = 30;
	// all todos in project
	const totalCount = 50;
	const progressPercentage = Math.round((completedCount / totalCount) * 100);

	return (
		<div className="h-full w-full flex flex-col bg-background overflow-hidden">
			{/* Project Header - Fixed */}
			<div className="flex-shrink-0 border-b border-border px-8 py-6">
				<div className="flex items-center gap-3 mb-2">
					<span className="text-4xl">🐍</span>
					<h1 className="text-3xl font-semibold">
						{projectDetail.project.name}
					</h1>
				</div>
				<p className="text-muted-foreground mb-4">
					{projectDetail.project.description}
				</p>

				<div className="flex items-center gap-4">
					<div className="text-sm text-muted-foreground">
						{completedCount} of {totalCount} completed ({progressPercentage}%)
					</div>
					<div className="flex-1 max-w-xs h-2 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-primary transition-all"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>
			</div>

			{/* Tasks grouped by sections - Scrollable */}
			<div className="flex-1 min-h-0 overflow-y-auto">
				<div className="p-8 space-y-6">
					{projectDetail.sections.map((section) => {
						return (
							<ProjectSection
								key={`section-${section.id}-${Math.random().toString(36).substring(2, 15)}`}
								section={section}
								projectId={projectId}
								projectName={projectDetail.project.name}
							/>
						);
					})}

					{/* Add New Section */}
					{isAddingSection ? (
						<div className="flex items-center gap-2">
							<GripVertical className="w-4 h-4 text-muted-foreground" />
							<Input
								value={newSectionName}
								onChange={(e) => setNewSectionName(e.target.value)}
								placeholder="Section name"
								className="h-9"
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter") handleAddSection();
									if (e.key === "Escape") {
										setIsAddingSection(false);
										setNewSectionName("");
									}
								}}
							/>
							<Button size="sm" onClick={handleAddSection}>
								Add
							</Button>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => {
									setIsAddingSection(false);
									setNewSectionName("");
								}}
							>
								Cancel
							</Button>
						</div>
					) : (
						<Button
							variant="ghost"
							className="w-full justify-start"
							onClick={() => setIsAddingSection(true)}
						>
							<Plus className="w-4 h-4 mr-2" />
							Add Section
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

function cn(...classes: (string | boolean | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}
