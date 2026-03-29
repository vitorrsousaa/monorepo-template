import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function AllProjectsListItemLoadingIndicator() {
	const { t } = useTranslation();
	return (
		<span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
			<Loader2 className="h-3 w-3 animate-spin" />
			{t("projects.allProjects.card.saving")}
		</span>
	);
}
