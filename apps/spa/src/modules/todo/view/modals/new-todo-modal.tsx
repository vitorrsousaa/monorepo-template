import type { TTodoFormSchema } from "@/modules/todo/view/forms/todo/todo-form.schema";
import { Button } from "@repo/ui/button";
import { Dialog, DialogContent } from "@repo/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Icon } from "@repo/ui/icon";
import { Activity, Copy, LinkIcon, MoreHorizontal, Trash2 } from "lucide-react";
import { TodoForm } from "../forms/todo";

interface NewTodoModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId?: string;
	sectionId?: string;
}

export function NewTodoModal(props: NewTodoModalProps) {
	const { isOpen, onClose, projectId, sectionId } = props;
	const initialValues: Partial<TTodoFormSchema> = {
		project: projectId,
		section: sectionId,
	};

	const handleDelete = () => {
		onClose();
	};

	const handleDuplicate = () => {
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-5xl p-0 gap-0">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-border">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Icon name="inbox" className="w-4 h-4" />
						<span>New Task</span>
					</div>
					<div className="flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className=" w-8 absolute top-4 right-10 h-[16px]"
								>
									<MoreHorizontal className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-64">
								<div className="px-2 py-1.5 text-xs text-muted-foreground">
									New task
								</div>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleDuplicate}>
									<Copy className="w-4 h-4 mr-2" />
									Duplicate
								</DropdownMenuItem>
								<DropdownMenuItem>
									<LinkIcon className="w-4 h-4 mr-2" />
									Copy link to task
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Activity className="w-4 h-4 mr-2" />
									View task activity
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive"
									onClick={handleDelete}
								>
									<Trash2 className="w-4 h-4 mr-2" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<TodoForm onCancel={onClose} initialValues={initialValues} />
			</DialogContent>
		</Dialog>
	);
}
