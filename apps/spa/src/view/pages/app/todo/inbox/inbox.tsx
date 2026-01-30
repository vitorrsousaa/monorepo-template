import { InboxTodoCard } from "@/modules/todo/view/components/inbox-todo-card";
import { Button } from "@repo/ui/button";
import { RenderIf } from "@repo/ui/render-if";
import { Plus } from "lucide-react";
import { useState } from "react";
import { InboxErrorState } from "./components/inbox-error-state";
import { InboxLoadingSkeleton } from "./components/inbox-loading";
import { useInboxHook } from "./inbox.hook";

export function Inbox() {
	const {
		inboxTodos,
		isLoadingInboxTodos,
		isErrorInboxTodos,
		shouldRenderInboxTodos,
		refetchInboxTodos,
	} = useInboxHook();

	const [_isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false);

	return (
		<div className="p-8 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-semibold text-balance">Inbox</h1>
					<p className="text-muted-foreground mt-1">Tasks without project</p>
				</div>
				<Button
					className="bg-primary text-primary-foreground hover:bg-primary/90"
					onClick={() => setIsNewTodoModalOpen(true)}
					disabled={isLoadingInboxTodos}
					type="button"
				>
					<Plus className="w-4 h-4 mr-2" />
					New Todo
				</Button>
			</div>

			<RenderIf
				condition={isLoadingInboxTodos}
				render={<InboxLoadingSkeleton />}
			/>
			<RenderIf
				condition={isErrorInboxTodos}
				render={<InboxErrorState onRetry={() => refetchInboxTodos()} />}
			/>
			<RenderIf
				condition={shouldRenderInboxTodos}
				render={
					<div className="space-y-2">
						{inboxTodos.map((todo) => (
							<InboxTodoCard key={todo.id} todo={todo} />
						))}
					</div>
				}
			/>

			{/* <NewTodoModal isOpen={isNewTodoModalOpen} onClose={() => setIsNewTodoModalOpen(false)} projectId={null} /> */}
		</div>
	);
}
