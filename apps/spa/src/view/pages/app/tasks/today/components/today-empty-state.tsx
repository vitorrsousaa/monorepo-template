import { ROUTES } from "@/config/routes";
import { NewProjectModal } from "@/modules/projects/view/modals/new-project-modal";
import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/utils";
import { Clock, FolderPlus, Plus } from "lucide-react";
import { useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type TodayEmptyStateProps = {
	onAddTask: () => void;
};

export function TodayEmptyState(props: TodayEmptyStateProps) {
	const { onAddTask } = props;
	const { t } = useTranslation();
	const [isNewProjectOpen, toggleNewProject] = useReducer(
		(s: boolean) => !s,
		false,
	);

	return (
		<>
			<div className="flex flex-col items-center px-6 py-14 pb-12 text-center sm:px-10">
				<div className="relative mb-6 h-20 w-20 shrink-0" aria-hidden>
					<div className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-border" />
					<div className="absolute left-3 top-3 h-14 w-14 rounded-full border-[1.5px] border-dashed border-primary/30" />
					<div
						className={cn(
							"absolute left-[22px] top-[22px] flex h-9 w-9 items-center justify-center rounded-full",
							"bg-primary/10 text-primary",
						)}
					>
						<Clock className="h-4 w-4" strokeWidth={1.6} />
					</div>
				</div>

				<h2 className="mb-1.5 text-base font-semibold tracking-tight text-foreground">
					{t("tasks.today.emptyHeadline")}
				</h2>
				<p className="mb-7 max-w-[300px] text-[13px] leading-relaxed text-muted-foreground">
					{t("tasks.today.emptySub")}
				</p>

				<div className="mb-10 flex flex-wrap items-center justify-center gap-2">
					<Button
						type="button"
						className="gap-1.5 rounded-[10px] px-[18px] py-2 text-[13px] font-medium"
						onClick={onAddTask}
					>
						<Plus className="h-3 w-3" strokeWidth={2} />
						{t("tasks.today.addTask")}
					</Button>
					<Button
						variant="outline"
						className="gap-1.5 rounded-[10px] border-border px-[18px] py-2 text-[13px] font-medium"
						asChild
					>
						<Link to={ROUTES.PROJECTS.LIST}>
							{t("tasks.today.browseProjects")}
						</Link>
					</Button>
				</div>

				<p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/80">
					{t("tasks.today.nextSteps")}
				</p>
				<div className="flex w-full max-w-[520px] justify-center">
					<button
						type="button"
						onClick={toggleNewProject}
						className={cn(
							"group flex min-h-[88px] w-full max-w-[200px] flex-col items-center justify-center gap-1 rounded-[14px] border border-dashed border-border",
							"bg-muted/30 text-center transition-colors",
							"hover:border-primary/50 hover:bg-primary/5",
						)}
					>
						<FolderPlus className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
						<span className="text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-primary">
							{t("tasks.today.createProjectCard")}
						</span>
						<span className="text-[11px] text-muted-foreground/70 group-hover:text-muted-foreground">
							{t("tasks.today.createProjectCardMeta")}
						</span>
					</button>
				</div>
			</div>

			<NewProjectModal isOpen={isNewProjectOpen} onClose={toggleNewProject} />
		</>
	);
}
