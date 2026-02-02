import { Dialog, DialogContent } from "@repo/ui/dialog";
import { Icon } from "@repo/ui/icon";
import { TodoForm } from "../forms/todo";

interface NewTodoModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: string | null;
}

export function NewTodoModal({
	isOpen,
	onClose,
	projectId,
}: NewTodoModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-5xl p-0 gap-0">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-border">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Icon name="inbox" className="w-4 h-4" />
						<span>New Task</span>
					</div>
				</div>

				<TodoForm onCancel={onClose} />
			</DialogContent>
		</Dialog>
	);
}
