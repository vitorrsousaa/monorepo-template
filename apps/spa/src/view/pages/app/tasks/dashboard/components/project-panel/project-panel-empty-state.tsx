import { NewProjectModal } from "@/modules/projects/view/modals/new-project-modal";
import { Button } from "@repo/ui/button";
import { FolderPlus, Plus } from "lucide-react";
import { useReducer } from "react";
import { useTranslation } from "react-i18next";

export const ProjectPanelEmptyState = () => {
	const { t } = useTranslation();
	const [isOpen, toggle] = useReducer((s: boolean) => !s, false);

	return (
		<div className="px-5 py-8 flex flex-col items-center justify-center gap-3 text-center">
			<div className="rounded-xl bg-muted/50 p-4">
				<FolderPlus className="h-6 w-6 text-muted-foreground" />
			</div>
			<div className="space-y-1">
				<p className="text-[13px] font-medium text-foreground">
					{t("dashboard.panels.projectsEmpty")}
				</p>
				<p className="text-xs text-muted-foreground">
					{t("dashboard.panels.projectsEmptyDesc")}
				</p>
			</div>
			<Button variant="outline" size="sm" className="h-8 text-xs" onClick={toggle}>
				<Plus className="h-3 w-3 mr-1.5" />
				{t("dashboard.panels.projectsNewButton")}
			</Button>
			<NewProjectModal isOpen={isOpen} onClose={toggle} />
		</div>
	);
};
