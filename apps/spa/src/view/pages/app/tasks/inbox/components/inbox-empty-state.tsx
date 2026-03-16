import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Inbox } from "lucide-react";

interface InboxEmptyStateProps {
	onCreateTask: () => void;
}

export function InboxEmptyState({ onCreateTask }: InboxEmptyStateProps) {
	return (
		<div className="flex items-center justify-center min-h-[400px] px-4">
			<Card className="max-w-md w-full p-8 text-center space-y-6 border-dashed">
				<div className="flex justify-center">
					<div className="relative">
						<div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
						<div className="relative bg-primary/10 p-6 rounded-full">
							<Inbox className="w-12 h-12 text-primary" strokeWidth={1.5} />
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<h3 className="text-2xl font-semibold">Your inbox is empty</h3>
					<p className="text-muted-foreground text-sm leading-relaxed">
						Start organizing your tasks by creating your first todo. Keep track
						of everything you need to do in one place.
					</p>
				</div>

				<div className="flex flex-col gap-3 pt-2">
					<Button
						onClick={onCreateTask}
						className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
						size="lg"
					>
						Create your first task
					</Button>
					<p className="text-xs text-muted-foreground">
						Tip: Use the "New Task" button in the header anytime
					</p>
				</div>
			</Card>
		</div>
	);
}
