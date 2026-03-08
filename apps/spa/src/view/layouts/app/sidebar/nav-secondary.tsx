import { HelpCircle, Settings, type LucideIcon } from "lucide-react";
import type * as React from "react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu
} from "@repo/ui/sidebar";
import { cn } from "@repo/ui/utils";
import { useState } from "react";

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const [currentView, setView] = useState<string>("configuracoes");

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					<div className="px-2 py-2 border-t border-b border-sidebar-border space-y-0.5">
						<button
							onClick={() => setView("configuracoes")}
							className={cn(
								"flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
								"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
								currentView === "configuracoes"
									? "bg-sidebar-accent text-sidebar-primary"
									: "text-sidebar-foreground/60"
							)}
						>
							<Settings className="w-4 h-4" />
							<span>Configurações</span>
						</button>
						<button
							onClick={() => setView("suporte")}
							className={cn(
								"flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
								"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
								currentView === "suporte"
									? "bg-sidebar-accent text-sidebar-primary"
									: "text-sidebar-foreground/60"
							)}
						>
							<HelpCircle className="w-4 h-4" />
							<span>Suporte</span>
						</button>
					</div>

				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
