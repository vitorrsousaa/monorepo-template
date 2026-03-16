import { TaskForm } from "@/modules/tasks/view/forms/task";
import type { TTaskFormSchema } from "@/modules/tasks/view/forms/task/task-form.schema";
import { Button } from "@repo/ui/button";
import { Dialog, DialogClose, DialogContent } from "@repo/ui/dialog";
import { Copy, Trash2, X } from "lucide-react";

interface EditTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialValues: Partial<TTaskFormSchema>;
	headerMeta?: { projectName?: string; createdAt?: string; updatedAt?: string };
	onDuplicate?: () => void;
	onDelete?: () => void;
}

export function EditTaskModal({
	isOpen,
	onClose,
	initialValues,
	headerMeta,
	onDuplicate,
	onDelete,
}: EditTaskModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className="max-w-[820px] p-0 gap-0 flex flex-col max-h-[85vh]"
				hideDefaultClose
			>
				<div className="flex items-center justify-between gap-1.5 px-4 py-3 border-b border-border shrink-0">
					<h2 className="text-sm font-medium text-foreground">Editing task</h2>
					<div className="flex items-center gap-1.5">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							title="Duplicate"
							onClick={onDuplicate}
						>
							<Copy className="w-3.5 h-3.5" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-7 w-7 hover:text-destructive"
							title="Delete"
							onClick={onDelete}
						>
							<Trash2 className="w-3.5 h-3.5" />
						</Button>
						<DialogClose asChild>
							<Button variant="ghost" size="icon" className="h-7 w-7">
								<X className="w-3.5 h-3.5" />
							</Button>
						</DialogClose>
					</div>
				</div>
				<TaskForm
					mode="edit"
					onCancel={onClose}
					initialValues={initialValues}
					metadata={headerMeta}
				/>
			</DialogContent>
		</Dialog>
	);
}
