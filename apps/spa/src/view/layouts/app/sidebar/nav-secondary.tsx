import type * as React from "react";
import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
} from "@repo/ui/sidebar";
import { cn } from "@repo/ui/utils";

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
	const { pathname } = useLocation();

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					<div className="px-2 py-2 border-t border-b border-sidebar-border space-y-0.5">
						{items.map(({ title, url, icon: Icon }) => {
							const isActive = pathname === url;
							return (
								<Link
									key={url}
									to={url}
									className={cn(
										"flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
										"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
										isActive
											? "bg-sidebar-accent text-sidebar-primary"
											: "text-sidebar-foreground/60",
									)}
								>
									<Icon className="w-4 h-4" />
									<span>{title}</span>
								</Link>
							);
						})}
					</div>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
