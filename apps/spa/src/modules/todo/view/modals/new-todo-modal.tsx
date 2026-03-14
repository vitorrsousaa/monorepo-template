import type { TTodoFormSchema } from "@/modules/todo/view/forms/todo/todo-form.schema";
import { TodoForm } from "../forms/todo";
import { Button } from "@repo/ui/button";
import { Dialog, DialogClose, DialogContent } from "@repo/ui/dialog";
import { X } from "lucide-react";

interface NewTodoModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId?: string;
	sectionId?: string;
}

export function NewTodoModal(props: NewTodoModalProps) {
	const { isOpen, onClose, projectId, sectionId } = props;
	const initialValues: Partial<TTodoFormSchema> = {
		project: projectId ?? "inbox",
		section: sectionId ?? "none",
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className="max-w-[620px] p-0 gap-0 flex flex-col max-h-[85vh]"
				hideDefaultClose
			>
				<div className="flex items-center justify-end px-4 py-3 border-b border-border shrink-0">
					<DialogClose asChild>
						<Button variant="ghost" size="icon" className="h-7 w-7">
							<X className="w-4 h-4" />
						</Button>
					</DialogClose>
				</div>
				<TodoForm
					mode="create"
					onCancel={onClose}
					initialValues={initialValues}
				/>
			</DialogContent>
		</Dialog>
	);
}
