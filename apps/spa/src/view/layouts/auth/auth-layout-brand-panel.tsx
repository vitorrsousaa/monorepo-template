import { Icon } from "@repo/ui/icon";
import { GoalIcon, LayoutDashboardIcon } from "lucide-react";

export function AuthLayoutBrandPanel() {
	return (
		<div className="brand-panel relative flex min-h-svh flex-col justify-between overflow-hidden bg-zinc-900 px-8 py-12 md:px-12">
			<div
				className="pointer-events-none absolute inset-0 z-0"
				aria-hidden
				style={{
					backgroundImage:
						"radial-gradient(circle, rgba(127,119,221,0.12) 1px, transparent 1px)",
					backgroundSize: "28px 28px",
				}}
			/>
			<div className="brand-logo relative z-10 flex items-center gap-2.5">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold tracking-tight text-primary-foreground">
					L
				</div>
				<span className="text-base font-semibold tracking-tight text-white">
					LifeOS
				</span>
			</div>

			<div className="brand-body relative z-10">
				<h2 className="brand-headline mb-3 text-[28px] font-semibold leading-tight tracking-tight text-white">
					Your life,
					<br />
					<span className="text-primary">organized.</span>
				</h2>
				<p className="brand-sub mb-9 max-w-[320px] text-sm leading-relaxed text-white/45">
					Tasks, goals and projects — all in one place. Built for people who
					want to move forward every day.
				</p>

				<div className="features flex flex-col gap-3">
					<div className="feature flex items-start gap-3">
						<div className="feature-icon flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/15 text-primary">
							<LayoutDashboardIcon className="h-4 w-4" />
						</div>
						<div className="feature-text">
							<div className="text-[13px] font-medium text-white">
								Projects & tasks
							</div>
							<div className="mt-0.5 text-xs text-white/40">
								Organize work in sections with priority and due dates
							</div>
						</div>
					</div>
					<div className="feature flex items-start gap-3">
						<div className="feature-icon flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/15 text-primary">
							<GoalIcon className="h-4 w-4" />
						</div>
						<div className="feature-text">
							<div className="text-[13px] font-medium text-white">
								Goals with real progress
							</div>
							<div className="mt-0.5 text-xs text-white/40">
								Link tasks to goals and track what actually matters
							</div>
						</div>
					</div>
					<div className="feature flex items-start gap-3">
						<div className="feature-icon flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/15 text-primary">
							<Icon name="arrowPath" className="h-4 w-4" />
						</div>
						<div className="feature-text">
							<div className="text-[13px] font-medium text-white">
								Recurring tasks
							</div>
							<div className="mt-0.5 text-xs text-white/40">
								Set habits once, let them show up automatically
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="brand-footer relative z-10 flex items-center gap-3.5 border-t border-white/[0.08] pt-5">
				<div className="avatars flex">
					<div className="avatar-small -ml-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 border-zinc-950 bg-violet-500 text-[10px] font-bold text-white first:ml-0">
						JA
					</div>
					<div className="avatar-small -ml-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 border-zinc-950 bg-emerald-500 text-[10px] font-bold text-white">
						MC
					</div>
					<div className="avatar-small -ml-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 border-zinc-950 bg-orange-500 text-[10px] font-bold text-white">
						RL
					</div>
					<div className="avatar-small -ml-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 border-zinc-950 bg-purple-500 text-[10px] font-bold text-white">
						+
					</div>
				</div>
				<p className="social-text text-xs text-white/40">
					<strong className="font-medium text-white/70">2,400+ people</strong>{" "}
					organizing their lives with LifeOS
				</p>
			</div>
		</div>
	);
}
