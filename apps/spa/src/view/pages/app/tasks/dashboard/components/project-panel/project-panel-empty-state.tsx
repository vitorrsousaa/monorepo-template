import { NewProjectModal } from "@/modules/projects/view/modals/new-project-modal";
import { Button } from "@repo/ui/button";
import { FolderPlus, Plus } from "lucide-react";
import { useReducer } from "react";

export const ProjectPanelEmptyState = () => {
	const [isOpen, toggle] = useReducer((s: boolean) => !s, false);

	return (
		<div className="px-5 py-8 flex flex-col items-center justify-center gap-3 text-center">
			<div className="rounded-xl bg-muted/50 p-4">
				<FolderPlus className="h-6 w-6 text-muted-foreground" />
			</div>
			<div className="space-y-1">
				<p className="text-[13px] font-medium text-foreground">No projects yet</p>
				<p className="text-xs text-muted-foreground">
					Create your first project to track your tasks
				</p>
			</div>
			<Button variant="outline" size="sm" className="h-8 text-xs" onClick={toggle}>
				<Plus className="h-3 w-3 mr-1.5" />
				New Project
			</Button>
			<NewProjectModal isOpen={isOpen} onClose={toggle} />
		</div>
	);
};
