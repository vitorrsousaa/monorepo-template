import { Button } from "@repo/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/dialog";
import { useCreateProject } from "../../app/hooks/use-create-project";
import { ProjectForm } from "../forms/project";
import type { TProjectFormSchema } from "../forms/project/project-form.schema";

interface NewProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
	const { createProject } = useCreateProject();

	const handleSubmit = async (data: TProjectFormSchema) => {
		console.log(data);
		createProject({
			name: data.name,
			description: data.description,
		});
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px] bg-card border-border">
				<DialogHeader>
					<DialogTitle>Create New Project</DialogTitle>
					<DialogDescription>
						Add a new project to organize your tasks
					</DialogDescription>
				</DialogHeader>

				<ProjectForm onSubmit={handleSubmit} formId="new-project-form" />

				<div className="flex justify-end gap-3">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						type="submit"
						className="bg-primary text-primary-foreground hover:bg-primary/90"
						form="new-project-form"
					>
						Create Project
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
