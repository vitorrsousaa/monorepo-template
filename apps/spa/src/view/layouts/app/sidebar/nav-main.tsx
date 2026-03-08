import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/sidebar";

export function NavMain({
	items,
}: {
	items: {
		url: string;
		label: string;
		icon: LucideIcon;
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.url}>
						<SidebarMenuButton asChild tooltip={item.label}>
							<Link to={item.url}>
								<item.icon />
								<span>{item.label}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
