import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from "@repo/ui/breadcrumb";
import { Separator } from "@repo/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@repo/ui/sidebar";
import { ThemeToggle } from "@repo/ui/theme-toggle";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./sidebar";

export function DashboardLayout() {
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
					<ThemeToggle />
				</header>
				<div className="flex flex-1 flex-col min-h-0 overflow-hidden">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
