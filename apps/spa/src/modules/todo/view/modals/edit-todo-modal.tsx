import { TodoForm } from "@/modules/todo/view/forms/todo";
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

interface EditTodoModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialValues: Partial<TTodoFormSchema>;
	headerMeta?: { projectName: string; createdAt: string };
}

export function EditTodoModal({
	isOpen,
	onClose,
	initialValues,
	headerMeta,
}: EditTodoModalProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl p-0 gap-0">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-border">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Icon name="inbox" className="w-4 h-4" />
						<span>{headerMeta?.projectName ?? "Task"}</span>
					</div>
					<div className="flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreHorizontal className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-64">
								{headerMeta?.createdAt && (
									<>
										<div className="px-2 py-1.5 text-xs text-muted-foreground">
											Added on {formatDate(headerMeta.createdAt)}
										</div>
										<DropdownMenuSeparator />
									</>
								)}
								<DropdownMenuItem>
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
								<DropdownMenuItem className="text-destructive" onClick={onClose}>
									<Trash2 className="w-4 h-4 mr-2" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

					</div>
				</div>

				<TodoForm initialValues={initialValues} onCancel={onClose} />
			</DialogContent>
		</Dialog>
	);
}
