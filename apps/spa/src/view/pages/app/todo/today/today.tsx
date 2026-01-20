import { ProjectColumn } from "@/modules/todo/components/project-column";
import { NewProjectModal } from "@/modules/todo/modals/new-project-modal";
import { Button } from "@repo/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PROJECTS_MOCKS } from "./today.mocks";

export interface Todo {
	id: string;
	title: string;
	description?: string;
	dueDate?: string;
	completed: boolean;
	tags?: string[];
	comments?: number;
	projectId: string;
}

export interface Project {
	id: string;
	name: string;
	emoji: string;
	todos: Todo[];
}

export function Today() {
	const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

	const [projects] = useState<Project[]>(PROJECTS_MOCKS);

	return (
		<div className="h-full w-full flex flex-col bg-background overflow-hidden">
			{/* Header - Fixed */}
			<div className="flex-shrink-0 border-b border-border px-8 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold text-balance">Today</h1>
						<p className="text-sm text-muted-foreground mt-1">
							{projects.reduce((acc, project) => acc + project.todos.length, 0)}{" "}
							tasks
						</p>
					</div>
					<Button
						className="bg-primary text-primary-foreground hover:bg-primary/90"
						onClick={() => setIsNewProjectModalOpen(true)}
					>
						<Plus className="w-4 h-4 mr-2" />
						New Project
					</Button>
				</div>
			</div>

			{/* Kanban Board - Scrollable Container */}
			<div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
				<div className="p-6 flex gap-4" style={{ minWidth: "max-content" }}>
					{projects.map((project) => (
						<ProjectColumn key={project.id} project={project} />
					))}
				</div>
			</div>

			<NewProjectModal
				isOpen={isNewProjectModalOpen}
				onClose={() => setIsNewProjectModalOpen(false)}
			/>
		</div>
	);
}
