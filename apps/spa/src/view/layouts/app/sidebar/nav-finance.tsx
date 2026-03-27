import {
	ChevronRight,
	CreditCard,
	LayoutDashboard,
	ListOrdered,
	PiggyBank,
	TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/config/routes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@repo/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/sidebar";

export function NavFinance() {
	const { t } = useTranslation();

	const items = [
		{ url: ROUTES.FINANCE.OVERVIEW, label: t("sidebar.financeOverview"), icon: LayoutDashboard },
		{ url: ROUTES.FINANCE.TRANSACTIONS, label: t("sidebar.financeTransactions"), icon: ListOrdered },
		{ url: ROUTES.FINANCE.BUDGETS, label: t("sidebar.financeBudgets"), icon: PiggyBank },
		{ url: ROUTES.FINANCE.ACCOUNTS, label: t("sidebar.financeAccounts"), icon: CreditCard },
		{ url: ROUTES.FINANCE.REPORTS, label: t("sidebar.financeReports"), icon: TrendingUp },
	];

	return (
		<SidebarGroup>
			<Collapsible className="group/collapsible">
				<SidebarGroupLabel asChild>
					<CollapsibleTrigger>
						{t("sidebar.finance")}
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
