import { ChevronRight, Share2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/config/routes";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@repo/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/sidebar";

export function NavShared() {
	const { t } = useTranslation();

	const items = [
		{
			url: ROUTES.SHARED.WITH_ME,
			label: t("sidebar.sharedWithMe"),
			icon: Users,
		},
		{
			url: ROUTES.SHARED.MY_CONTENT,
			label: t("sidebar.sharedMyContent"),
			icon: Share2,
		},
	];

	return (
		<SidebarGroup>
			<Collapsible className="group/collapsible">
				<SidebarGroupLabel asChild>
					<CollapsibleTrigger>
						{t("sidebar.shared")}
						<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
					</CollapsibleTrigger>
				</SidebarGroupLabel>
				<CollapsibleContent>
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
				</CollapsibleContent>
			</Collapsible>
		</SidebarGroup>
	);
}
