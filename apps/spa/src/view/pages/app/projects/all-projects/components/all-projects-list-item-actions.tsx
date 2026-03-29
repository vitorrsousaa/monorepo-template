import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/config/routes";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Eye, History, MoreHorizontal, Trash2 } from "lucide-react";

interface AllProjectsListItemActionsProps {
	projectId: string;
	onDeleteConfirm: () => void;
}

export function AllProjectsListItemActions(
	props: AllProjectsListItemActionsProps,
) {
	const { projectId, onDeleteConfirm } = props;
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground"
					onClick={(e) => e.stopPropagation()}
				>
					<MoreHorizontal className="h-4 w-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-48"
				onClick={(e) => e.stopPropagation()}
			>
				<DropdownMenuItem
					onSelect={() =>
						navigate(ROUTES.PROJECTS.PROJECT_DETAILS.replace(":id", projectId))
					}
				>
					<Eye className="text-muted-foreground" />
					<span>{t("projects.allProjects.card.viewProject")}</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<History className="text-muted-foreground" />
					<span>{t("projects.allProjects.card.viewActivity")}</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-destructive focus:text-destructive"
					onSelect={() => onDeleteConfirm()}
				>
					<Trash2 className="text-muted-foreground" />
					<span>{t("projects.allProjects.card.deleteProject")}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
