import { Button } from "@repo/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProjectPanelErrorStateProps {
	onRetry: () => void;
}

export const ProjectPanelErrorState = (props: ProjectPanelErrorStateProps) => {
	const { onRetry } = props;
	const { t } = useTranslation();

	return (
		<div className="px-5 py-8 flex flex-col items-center justify-center gap-3 text-center">
			<div className="rounded-xl bg-destructive/10 p-4">
				<AlertCircle className="h-6 w-6 text-destructive" />
			</div>
			<div className="space-y-1">
				<p className="text-[13px] font-medium text-foreground">
					{t("dashboard.panels.projectsError")}
				</p>
				<p className="text-xs text-muted-foreground">
					{t("dashboard.panels.projectsErrorDesc")}
				</p>
			</div>
			<Button variant="outline" size="sm" className="h-8 text-xs" onClick={onRetry}>
				<RefreshCw className="h-3 w-3 mr-1.5" />
				{t("dashboard.panels.projectsRetryButton")}
			</Button>
		</div>
	);
};
