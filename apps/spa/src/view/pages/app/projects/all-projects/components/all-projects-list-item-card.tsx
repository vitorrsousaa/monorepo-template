import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/config/routes";
import { OptimisticState } from "@/utils/types";
import { Card } from "@repo/ui/card";
import { cn } from "@repo/ui/utils";

interface AllProjectsListItemCardProps {
	children: React.ReactNode;
	projectId: string;
	optimisticState?: OptimisticState;
	isCompleted: boolean;
	color: string;
}

export function AllProjectsListItemCard(props: AllProjectsListItemCardProps) {
	const { children, projectId, optimisticState, isCompleted, color } = props;

	const navigate = useNavigate();

	const isMuted = isCompleted;
	const isPending = optimisticState === OptimisticState.PENDING;
	const isOptimisticError = optimisticState === OptimisticState.ERROR;
	const isSynced =
		optimisticState === OptimisticState.SYNCED || !optimisticState;
	const isNavigable = isSynced;

	return (
		<Card
			className={cn(
				"group flex flex-col overflow-hidden rounded-2xl border bg-card text-left transition-all duration-200",
				isNavigable && "cursor-pointer hover:border-border/80 hover:shadow-sm",
				!isPending && !isOptimisticError && !isMuted && "border-border",
				isMuted && isSynced && "border-border/70 opacity-70 hover:opacity-90",
				isPending && "cursor-not-allowed opacity-60 border-border/50",
				isOptimisticError &&
					"cursor-not-allowed border-destructive/50 bg-destructive/5",
			)}
			onClick={() => {
				if (!isNavigable) return;
				navigate(ROUTES.PROJECTS.PROJECT_DETAILS.replace(":id", projectId));
			}}
		>
			<div
				className={cn("h-[3px] w-full", isPending && "animate-pulse")}
				style={{
					backgroundColor: isOptimisticError
						? "var(--destructive)"
						: isMuted || isPending
							? "rgba(148,163,184,0.9)"
							: color,
				}}
			/>
			{children}
		</Card>
	);
}
