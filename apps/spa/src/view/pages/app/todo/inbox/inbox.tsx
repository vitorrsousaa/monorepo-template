import { InboxTodoCard } from "@/modules/todo/view/components/inbox-todo-card";
import { NewTodoModal } from "@/modules/todo/view/modals/new-todo-modal";
import { Button } from "@repo/ui/button";
import { RenderIf } from "@repo/ui/render-if";
import { Plus } from "lucide-react";
import { useState } from "react";
import { InboxEmptyState } from "./components/inbox-empty-state";
import { InboxErrorState } from "./components/inbox-error-state";
import { InboxLoadingSkeleton } from "./components/inbox-loading";
import { useInboxHook } from "./inbox.hook";

export function Inbox() {
	const {
		inboxTodos,
		isFetchingTodos,
		isErrorInboxTodos,
		shouldRenderInboxTodos,
		refetchInboxTodos,
	} = useInboxHook();

	const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false);

	return (
		<div className="p-8 space-y-8">
			<div className="flex items-center justify-between border-b border-border pb-5">
				<div>
					<h1 className="text-[26px] font-semibold tracking-tight text-balance">
						Inbox
					</h1>
					<p className="mt-1 text-xs text-muted-foreground">
						Tasks sem projeto atribuído
					</p>
				</div>
				<Button
					className="gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
					onClick={() => setIsNewTodoModalOpen(true)}
					disabled={isFetchingTodos}
					type="button"
				>
					<Plus className="mr-1 h-3.5 w-3.5" />
					Nova tarefa
				</Button>
			</div>

			<RenderIf condition={isFetchingTodos} render={<InboxLoadingSkeleton />} />
			<RenderIf
				condition={isErrorInboxTodos}
				render={<InboxErrorState onRetry={() => refetchInboxTodos()} />}
			/>
			<RenderIf
				condition={
					!shouldRenderInboxTodos && !isFetchingTodos && !isErrorInboxTodos
				}
				render={
					<InboxEmptyState onCreateTodo={() => setIsNewTodoModalOpen(true)} />
				}
			/>
			<RenderIf
				condition={shouldRenderInboxTodos}
				render={
					<div className="max-h-[calc(100vh-220px)] overflow-y-auto pb-10">
						<div className="mx-auto max-w-3xl rounded-xl border border-border bg-card overflow-hidden">
							<div className="divide-y divide-border">
								{inboxTodos.map((todo) => (
									<InboxTodoCard key={todo.id} todo={todo} />
								))}
							</div>
						</div>
					</div>
				}
			/>

			<NewTodoModal
				isOpen={isNewTodoModalOpen}
				onClose={() => setIsNewTodoModalOpen(false)}
			/>
		</div>
	);
}
