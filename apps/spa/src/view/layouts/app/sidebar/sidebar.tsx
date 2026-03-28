import {
	CalendarClock,
	CalendarDays,
	CheckSquare,
	Inbox,
	LayoutDashboard,
	Target,
} from "lucide-react";
import type * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/config/routes";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/sidebar";
import { NavFinance } from "./nav-finance";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavShared } from "./nav-shared";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { t } = useTranslation();

	const navMain = [
		{ url: ROUTES.TASKS.INBOX, label: t("sidebar.inbox"), icon: Inbox },
		{
			url: ROUTES.TASKS.DASHBOARD,
			label: t("sidebar.dashboard"),
			icon: LayoutDashboard,
		},
		{ url: ROUTES.TASKS.TODAY, label: t("sidebar.today"), icon: CalendarDays },
		{
			url: ROUTES.TASKS.UPCOMING,
			label: t("sidebar.soon"),
			icon: CalendarClock,
		},
		{ url: ROUTES.GOALS_DASHBOARD, label: t("sidebar.goals"), icon: Target },
	];

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to={ROUTES.TASKS.DASHBOARD}>
								<div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg shrink-0">
									<CheckSquare className="w-4 h-4 text-primary-foreground" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">LifeOS</span>
									<span className="truncate text-xs">Enterprise</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
				<NavProjects />
				<NavFinance />
				<NavShared />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
