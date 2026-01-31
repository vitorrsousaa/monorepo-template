import { NewProjectModal } from "@/modules/projects/view/modals/new-project-modal";
import { FolderPlus, Plus } from "lucide-react";

import { Button } from "@repo/ui/button";
import { useReducer } from "react";

export const ProjectListEmptyState = () => {
	const [isNewProjectModalOpen, toggleNewProjectModal] = useReducer(
		(state) => !state,
		false,
	);

	return (
		<div className="px-2 py-4 space-y-3">
			<div className="flex flex-col items-center justify-center gap-2 text-center">
				<div className="rounded-lg bg-muted/50 p-3">
					<FolderPlus className="h-5 w-5 text-muted-foreground" />
				</div>
				<div className="space-y-1">
					<p className="text-xs font-medium">No projects yet</p>
					<p className="text-xs text-muted-foreground">
						Create your first project
					</p>
				</div>
			</div>
			<Button
				variant="outline"
				size="sm"
				className="w-full h-8 text-xs"
				onClick={toggleNewProjectModal}
			>
				<Plus className="h-3 w-3 mr-1.5" />
				New Project
			</Button>

			<NewProjectModal
				isOpen={isNewProjectModalOpen}
				onClose={toggleNewProjectModal}
			/>
		</div>
	);
};
