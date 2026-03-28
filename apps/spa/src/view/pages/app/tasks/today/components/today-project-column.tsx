import { TaskListCard } from "@/components/task-list-card";
import type { TaskWithOptimisticState } from "@/modules/tasks/app/cache/types";
import type { TodayTasksResponseWithOptimisticState } from "@/modules/tasks/app/hooks/use-get-today-tasks";
import { useUpdateTaskCompletion } from "@/modules/tasks/app/hooks/use-update-task-completion";
import { OptimisticState } from "@/utils/types";
import { TodayProjectColumnHeader } from "./today-project-column-header";

export type TodayProjectColumnProps = {
  project: TodayTasksResponseWithOptimisticState['projects'][number]
}

export function TodayProjectColumn(props: TodayProjectColumnProps) {
  const { project } = props

  const { toggleTaskCompletion } = useUpdateTaskCompletion();

  const handleTaskCheck = (task: TaskWithOptimisticState, checked: boolean) => {
    if (!task.id || task?.optimisticState !== OptimisticState.SYNCED) return;
    toggleTaskCompletion({
      taskId: task.id,
      projectId: task.projectId ?? null,
      nextCompleted: checked,
      task,
    });
  };
  return (
    <>
      <div className="flex-shrink-0 w-80 h-full flex flex-col rounded-[14px] border border-border bg-card overflow-hidden">
        <div
          className="h-[3px] w-full flex-shrink-0"
          style={{ background: project.color }}
          aria-hidden
        />
        <div className="px-3 pt-2 pb-2 border-b border-border/70 flex-shrink-0">
          <TodayProjectColumnHeader
            project={project}
          />
        </div>

        {/* Task Cards */}
        <div className="flex-1 overflow-y-auto min-h-0 px-2 py-3">
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            <div className="mx-auto max-w-3xl">
              <TaskListCard
                projectId={project.id}
                tasks={project.tasks}
                onTaskCheck={handleTaskCheck}
              />
            </div>
          </div>
        </div>


      </div>




    </>
  )
}