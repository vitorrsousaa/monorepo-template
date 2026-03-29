import { useTranslation } from "react-i18next";

interface AllProjectsListItemFooterProps {
	isFinished: boolean;
	remaining: number;
}

export function AllProjectsListItemFooter(
	props: AllProjectsListItemFooterProps,
) {
	const { isFinished, remaining } = props;
	const { t } = useTranslation();

	return (
		<div className="flex items-center justify-between pt-0.5">
			<span className="text-[11px] text-muted-foreground">
				{isFinished
					? t("projects.allProjects.card.finished")
					: t("projects.allProjects.card.remaining", {
							count: remaining,
						})}
			</span>
		</div>
	);
}
