import { SidebarMenuItem, SidebarMenuSkeleton } from "@repo/ui/sidebar";

export const ProjectListSkeleton = () => {
	return (
		<>
			<SidebarMenuItem>
				<SidebarMenuSkeleton />
			</SidebarMenuItem>
			<SidebarMenuItem>
				<SidebarMenuSkeleton />
			</SidebarMenuItem>
			<SidebarMenuItem>
				<SidebarMenuSkeleton />
			</SidebarMenuItem>
		</>
	);
};
