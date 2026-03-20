import { ROUTES } from "@/config/routes";
import { NewTaskModal } from "@/modules/tasks/view/modals/new-task-modal";
import { Button } from "@repo/ui/button";
import { LayoutGrid, Plus, Settings } from "lucide-react";
import { useReducer } from "react";
import { Link } from "react-router-dom";

type ProjectTopbarProps = {
	projectName: string;
	projectId: string;
};

export function ProjectTopbar({ projectName, projectId }: ProjectTopbarProps) {
	const [isNewTaskModalOpen, toggleIsNewTaskModalOpen] = useReducer((state) => !state, false);

	return (
		<>
			<div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border bg-background px-8">
				<div className="flex items-center gap-2 text-[13px] text-muted-foreground">
					<Link
						to={ROUTES.PROJECTS.LIST}
						className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
					>
						<LayoutGrid className="h-3.5 w-3.5" aria-hidden />
						<span>Projects</span>
					</Link>
					<span className="text-border" aria-hidden>
						/
					</span>
					<span className="font-medium text-foreground">{projectName}</span>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						className="h-[30px] w-[30px] rounded-md border-border text-muted-foreground hover:text-foreground"
						aria-label="Settings"
					>
						<Settings className="h-3.5 w-3.5" />
					</Button>
					<Button
						size="sm"
						className="h-8 gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90"
						onClick={toggleIsNewTaskModalOpen}
					>
						<Plus className="h-3.5 w-3.5" />
						Add task
					</Button>
				</div>
			</div>

			<NewTaskModal
				isOpen={isNewTaskModalOpen}
				onClose={toggleIsNewTaskModalOpen}
				projectId={projectId}

			/>
		</>
	);
}
