import { Button } from "@repo/ui/button";
import { Folder, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AllProjectsEmptyStateProps {
	onNewProject: () => void;
	isFiltered: boolean;
}

export function AllProjectsEmptyState(props: AllProjectsEmptyStateProps) {
	const { onNewProject, isFiltered } = props;
	const { t } = useTranslation();

	return (
		<div className="flex flex-col items-center justify-center py-20 text-center">
			<Folder className="w-10 h-10 text-muted-foreground/30 mb-3" />
			<p className="text-sm font-medium text-muted-foreground">
				{t("projects.allProjects.empty.title")}
			</p>
			<p className="text-xs text-muted-foreground/60 mt-1">
				{isFiltered
					? t("projects.allProjects.empty.filteredDesc")
					: t("projects.allProjects.empty.emptyDesc")}
			</p>
			{!isFiltered && (
				<Button
					size="sm"
					variant="outline"
					className="mt-4"
					onClick={onNewProject}
				>
					<Plus className="w-3.5 h-3.5 mr-1.5" />
					{t("projects.allProjects.newProject")}
				</Button>
			)}
		</div>
	);
}
