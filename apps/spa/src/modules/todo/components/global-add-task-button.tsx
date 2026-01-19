import { NewTodoModal } from "@/modules/todo/modals/new-todo-modal";
import { Button } from "@repo/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function GlobalAddTaskButton() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
				onClick={() => setIsOpen(true)}
			>
				<Plus className="w-6 h-6" />
			</Button>
			<NewTodoModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				projectId={null}
			/>
		</>
	);
}
