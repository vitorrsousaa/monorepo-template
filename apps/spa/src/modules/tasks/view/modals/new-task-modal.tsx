import { useCreateTasks } from "@/modules/tasks/app/hooks/use-create-tasks";
import type { TTaskFormSchema } from "@/modules/tasks/view/forms/task/task-form.schema";
import { PROJECTS_DEFAULT_IDS } from "@repo/contracts/enums";
import { Button } from "@repo/ui/button";
import { Dialog, DialogClose, DialogContent } from "@repo/ui/dialog";
import { X } from "lucide-react";
import { mapTaskFormToCreateInput } from "../../app/mappers/create-tasks";
import { TaskForm } from "../forms/task";

interface NewTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId?: string;
	sectionId?: string;
}

export function NewTaskModal(props: NewTaskModalProps) {
	const { isOpen, onClose, projectId, sectionId } = props;
	const initialValues: Partial<TTaskFormSchema> = {
		project: projectId ?? PROJECTS_DEFAULT_IDS.INBOX,
		section: sectionId ?? PROJECTS_DEFAULT_IDS.INBOX,
	};

	const { createTasks } = useCreateTasks();

	async function handleSubmit(data: TTaskFormSchema) {
		const taskInput = mapTaskFormToCreateInput(data);
		createTasks(taskInput);
		onClose();
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className="max-w-[820px] p-0 gap-0 flex flex-col max-h-[85vh]"
				hideDefaultClose
			>
				<div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
					<h2 className="text-sm font-medium text-foreground">Creating task</h2>
					<DialogClose asChild>
						<Button variant="ghost" size="icon" className="h-7 w-7">
							<X className="w-4 h-4" />
						</Button>
					</DialogClose>
				</div>
				<TaskForm
					mode="create"
					onCancel={onClose}
					initialValues={initialValues}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	);
}
