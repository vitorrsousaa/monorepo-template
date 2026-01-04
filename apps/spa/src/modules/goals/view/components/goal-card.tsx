import type { Goal } from "@/modules/goals/app/entities/goal";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { MoreVertical, Timer } from "lucide-react";

type GoalCardProps = {
  goal: Goal;
}

export function GoalCard(props: GoalCardProps) {
  const { goal } = props;

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Timer className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-balance">{
              goal.name
            }</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {goal.description}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">2/10 tasks</span>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[20%]" style={{ width: `${goal.progress}%` }} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-chart-2">{goal.progress}% complete</span>
            <span className="text-muted-foreground">8 pending</span>
          </div>
        </div>
      </div>
    </Card>
  );
}