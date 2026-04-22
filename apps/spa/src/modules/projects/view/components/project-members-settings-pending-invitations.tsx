import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Mail } from "lucide-react";

const MOCK_PENDING_INVITES = [
	{
		id: "mock-1",
		email: "ana.souza@email.com",
		invitedAgo: "2 days ago",
		permissionLabel: "Can edit",
	},
	{
		id: "mock-2",
		email: "carla.mendes@email.com",
		invitedAgo: "5 days ago",
		permissionLabel: "Can view",
	},
] as const;

export function ProjectMembersSettingsPendingInvitations() {
	return (
		<section className="space-y-2">
			<h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
				Pending invites · {MOCK_PENDING_INVITES.length}
			</h3>
			<ul className="flex flex-col gap-0.5">
				{MOCK_PENDING_INVITES.map((invite) => (
					<li
						key={invite.id}
						className="group flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 opacity-[0.65] transition-[opacity,background-color] hover:bg-muted/40 hover:opacity-100"
					>
						<div
							className="flex size-8 shrink-0 items-center justify-center rounded-full border border-dashed border-border bg-muted/60 text-muted-foreground"
							aria-hidden
						>
							<Mail className="size-3.5 stroke-[1.5]" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-[13px] font-medium text-foreground">
								{invite.email}
							</p>
							<p className="truncate text-[11px] text-muted-foreground">
								Invited {invite.invitedAgo} · {invite.permissionLabel}
							</p>
						</div>
						<Badge
							variant="secondary"
							className="shrink-0 rounded-lg border-0 bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground"
						>
							Pending
						</Badge>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-7 shrink-0 whitespace-nowrap px-2 text-[11px] font-medium opacity-0 transition-opacity group-hover:opacity-100 hover:border-transparent hover:bg-destructive/10 hover:text-destructive"
							aria-label={`Revoke invite for ${invite.email}`}
						>
							Revoke
						</Button>
					</li>
				))}
			</ul>
		</section>
	);
}
