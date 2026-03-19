import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InboxEmptyStateProps {
	onCreateTask: () => void;
}

export function InboxEmptyState({ onCreateTask }: InboxEmptyStateProps) {
	const { t } = useTranslation();

	return (
		<div className="flex items-center justify-center min-h-[400px] px-4">
			<Card className="max-w-md w-full p-8 text-center space-y-6 border-dashed">
				<div className="flex justify-center">
					<div className="relative">
						<div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
						<div className="relative bg-primary/10 p-6 rounded-full">
							<Inbox className="w-12 h-12 text-primary" strokeWidth={1.5} />
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<h3 className="text-2xl font-semibold">{t("tasks.inbox.emptyTitle")}</h3>
					<p className="text-muted-foreground text-sm leading-relaxed">
						{t("tasks.inbox.emptyDesc")}
					</p>
				</div>

				<div className="flex flex-col gap-3 pt-2">
					<Button
						onClick={onCreateTask}
						className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
						size="lg"
					>
						{t("tasks.inbox.createFirst")}
					</Button>
					<p className="text-xs text-muted-foreground">{t("tasks.inbox.tip")}</p>
				</div>
			</Card>
		</div>
	);
}
