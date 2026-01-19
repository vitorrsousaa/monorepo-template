import type { Goal } from "@/modules/goals/app/entities/goal";
import { Card } from "@repo/ui/card";
import { Timer } from "lucide-react";
import { GoalActionsDropdown } from "./goal-actions";

type GoalCardProps = {
	goal: Goal;
};

export function GoalCard(props: GoalCardProps) {
	const { goal } = props;

	return (
		<Card className="p-6 bg-card border-border">
			<div className="flex items-start justify-between mb-4 gap-3">
				<div className="flex items-start gap-3 flex-1 min-w-0">
					<div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
						<Timer className="w-5 h-5 text-primary" />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="text-lg font-semibold truncate">{goal.name}</h3>
						<p className="text-sm text-muted-foreground mt-1 line-clamp-2">
							{goal.description}
						</p>
					</div>
				</div>
				<GoalActionsDropdown goalId={goal.id} />
			</div>

			<div className="space-y-3">
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">Progress</span>
					<span className="font-medium">
						{goal.tasks - goal.pending}/{goal.tasks} tasks
					</span>
				</div>
				<div className="space-y-2">
					<div className="h-2 bg-secondary rounded-full overflow-hidden">
						<div
							className="h-full bg-primary w-[20%]"
							style={{ width: `${goal.progress}%` }}
						/>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-chart-2">{goal.progress}% complete</span>
						<span className="text-muted-foreground">
							{goal.pending} pending
						</span>
					</div>
				</div>
			</div>
		</Card>
	);
}
