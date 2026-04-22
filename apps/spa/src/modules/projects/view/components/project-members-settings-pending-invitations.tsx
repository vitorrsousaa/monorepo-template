import { useGetProjectInvitations } from "@/modules/sharing/app/hooks/use-get-project-invitations";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { RenderIf } from "@repo/ui/render-if";
import { Skeleton } from "@repo/ui/skeleton";
import { Mail } from "lucide-react";

interface ProjectMembersSettingsPendingInvitationsProps {
	projectId: string;
}

export function ProjectMembersSettingsPendingInvitations(
	props: ProjectMembersSettingsPendingInvitationsProps,
) {
	const { projectId } = props;

	const {
		invitations,
		isPendingProjectInvitations,
		isErrorProjectInvitations,
	} = useGetProjectInvitations({
		projectId,
		enabled: true,
	});

	return (
		<section className="space-y-2">
			<h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
				Pending invites ·{" "}
				<RenderIf
					condition={!isPendingProjectInvitations && !isErrorProjectInvitations}
					render={invitations?.length ?? 0}
				/>
			</h3>
			<RenderIf
				condition={isPendingProjectInvitations}
				render={<Skeleton className="h-10 w-full" />}
				fallback={
					<ul className="flex flex-col gap-0.5">
						{invitations.map((invite) => {
							const permissionLabel =
								invite.role === "editor" ? "Can edit" : "Can view";

							return (
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
											{invite.invitedEmail}
										</p>
										<p className="truncate text-[11px] text-muted-foreground">
											Invited invitedAgo · {permissionLabel}
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
										className="h-6 shrink-0 whitespace-nowrap px-2 text-[11px] font-medium opacity-0 transition-opacity group-hover:opacity-100 hover:border-transparent hover:bg-destructive/10 hover:text-destructive"
										aria-label={`Revoke invite for ${invite.invitedEmail}`}
									>
										Revoke
									</Button>
								</li>
							);
						})}
					</ul>
				}
			/>
		</section>
	);
}
