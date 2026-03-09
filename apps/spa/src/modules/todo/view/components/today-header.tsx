import { NewProjectModal } from "@/modules/projects/view/modals/new-project-modal";
import { Button } from "@repo/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export interface TodayTasksHeaderProps {
  taskCount: number;
  isLoading?: boolean;
}

export function TodayTasksHeader(props: TodayTasksHeaderProps) {
  const { taskCount, isLoading = false } = props;
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  return (
    <div className="flex-shrink-0 border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-balance">Today</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}{" "}
            · {taskCount} tarefas
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsNewProjectModalOpen(true)}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
}
