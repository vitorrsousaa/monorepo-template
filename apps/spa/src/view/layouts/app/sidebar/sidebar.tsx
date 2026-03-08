import {
	CalendarClock,
	CalendarDays,
	CheckSquare,
	Inbox,
	LayoutDashboard,
	LifeBuoy,
	Send,
	Target
} from "lucide-react";
import type * as React from "react";
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
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{ url: ROUTES.TODO.INBOX, label: "Inbox", icon: Inbox },
		{ url: ROUTES.TODO.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
		{ url: ROUTES.TODO.TODAY, label: "Hoje", icon: CalendarDays },
		{ url: ROUTES.TODO.UPCOMING, label: "Em breve", icon: CalendarClock },
		{ url: ROUTES.GOALS_DASHBOARD, label: "Metas", icon: Target },
	],
	navSecondary: [
		{
			title: "Support",
			url: "#",
			icon: LifeBuoy,
		},
		{
			title: "Feedback",
			url: "#",
			icon: Send,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to={ROUTES.TODO.DASHBOARD}>
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
				<NavMain items={data.navMain} />
				<NavProjects />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
