import { ROUTES } from "@/config/routes";
import { NOTIFICATIONS_MOCK } from "@/pages/app/user/notifications/notifications.mock";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from "@repo/ui/breadcrumb";
import { Button } from "@repo/ui/button";
import { Separator } from "@repo/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@repo/ui/sidebar";
import { ThemeToggle } from "@repo/ui/theme-toggle";
import { Bell } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./sidebar";

export function DashboardLayout() {
	const navigate = useNavigate();
	const unreadCount = NOTIFICATIONS_MOCK.filter(
		(n) => n.status === "unread",
	).length;

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="flex flex-col h-screen overflow-hidden">
				<header className="flex h-16 shrink-0 items-center gap-2 justify-between mr-3">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink>Artemis</BreadcrumbLink>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							className="relative text-muted-foreground hover:text-foreground"
							onClick={() => navigate(ROUTES.USER.NOTIFICATIONS)}
						>
							<Bell className="h-4 w-4" />
							{unreadCount > 0 && (
								<span className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
									{unreadCount}
								</span>
							)}
							<span className="sr-only">Notificações</span>
						</Button>
						<ThemeToggle />
					</div>
				</header>
				<div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
