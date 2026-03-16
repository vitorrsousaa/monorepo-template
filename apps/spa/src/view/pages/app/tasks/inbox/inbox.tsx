import { InboxTaskCard } from "@/modules/tasks/view/components/inbox-task-card";
import { NewTaskModal } from "@/modules/tasks/view/modals/new-task-modal";
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
		inboxTasks,
		isFetchingTasks,
		isErrorInboxTasks,
		shouldRenderInboxTasks,
		refetchInboxTasks,
	} = useInboxHook();

	const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

	return (
		<div className="p-8 space-y-8">
			<div className="flex items-center justify-between border-b border-border pb-5">
				<div>
					<h1 className="text-[26px] font-semibold tracking-tight text-balance">
						Inbox
					</h1>
					<p className="mt-1 text-xs text-muted-foreground">
						Tasks without a project assigned
					</p>
				</div>
				<Button
					className="gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
					onClick={() => setIsNewTaskModalOpen(true)}
					disabled={isFetchingTasks}
					type="button"
				>
					<Plus className="mr-1 h-3.5 w-3.5" />
					Add task
				</Button>
			</div>

			<RenderIf condition={isFetchingTasks} render={<InboxLoadingSkeleton />} />
			<RenderIf
				condition={isErrorInboxTasks}
				render={<InboxErrorState onRetry={() => refetchInboxTasks()} />}
			/>
			<RenderIf
				condition={
					!shouldRenderInboxTasks && !isFetchingTasks && !isErrorInboxTasks
				}
				render={
					<InboxEmptyState onCreateTask={() => setIsNewTaskModalOpen(true)} />
				}
			/>
			<RenderIf
				condition={shouldRenderInboxTasks}
				render={
					<div className="max-h-[calc(100vh-220px)] overflow-y-auto pb-10">
						<div className="mx-auto max-w-3xl rounded-xl border border-border bg-card overflow-hidden">
							<div className="divide-y divide-border">
								{inboxTasks.map((task) => (
									<InboxTaskCard key={task.id} task={task} />
								))}
							</div>
						</div>
					</div>
				}
			/>

			<NewTaskModal
				isOpen={isNewTaskModalOpen}
				onClose={() => setIsNewTaskModalOpen(false)}
			/>
		</div>
	);
}
