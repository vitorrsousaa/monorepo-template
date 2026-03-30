import { useToggle } from "@/hooks/toggle";
import { NewTaskModal } from "@/modules/tasks/view/modals/new-task-modal";
import { Button } from "@repo/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DashboardTasksPanelEmpty() {
	const { t } = useTranslation();
	const [isNewTaskModalOpen, toggleNewTaskModal] = useToggle();

	return (
		<>
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<CheckCircle2 className="w-10 h-10 text-muted-foreground/40 mb-3" />
				<p className="font-medium text-muted-foreground">
					{t("dashboard.panels.nothingToday")}
				</p>
				<p className="text-sm text-muted-foreground/60 mt-1">
					{t("dashboard.panels.nothingTodayDesc")}
				</p>
				<Button onClick={toggleNewTaskModal} className="mt-2" variant="outline">
					{t("dashboard.panels.createTask")}
				</Button>
			</div>
			<NewTaskModal isOpen={isNewTaskModalOpen} onClose={toggleNewTaskModal} />
		</>
	);
}
