import { languageStorage } from "@/storage/language-storage";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { useTheme } from "@repo/ui/providers";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/select";
import { Separator } from "@repo/ui/separator";
import { Switch } from "@repo/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { cn } from "@repo/ui/utils";
import { AlertTriangle, Monitor, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h3 className="text-base font-semibold text-foreground mb-4">{children}</h3>
	);
}

function SettingRow({
	label,
	description,
	children,
}: {
	label: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-3">
			<div className="flex-1">
				<p className="text-sm font-medium text-foreground">{label}</p>
				{description && (
					<p className="text-xs text-muted-foreground mt-0.5">{description}</p>
				)}
			</div>
			<div className="shrink-0">{children}</div>
		</div>
	);
}

export function Settings() {
	const { theme, setTheme } = useTheme();
	const { t, i18n } = useTranslation();
	const [notifs, setNotifs] = useState({
		email: true,
		push: false,
		tarefas: true,
		metas: true,
		resumo: false,
	});

	const toggleNotif = (key: keyof typeof notifs) =>
		setNotifs((n) => ({ ...n, [key]: !n[key] }));

	function handleLangChange(lang: string) {
		i18n.changeLanguage(lang);
		languageStorage.set(lang);
	}

	return (
		<div className="flex-1 p-6 max-w-4xl mx-auto space-y-6 w-full">
			<div>
				<h2 className="text-xl font-bold text-foreground">
					{t("settings.title")}
				</h2>
				<p className="text-sm text-muted-foreground mt-0.5">
					{t("settings.subtitle")}
				</p>
			</div>

			<Tabs defaultValue="notificacoes" className="space-y-6 w-full">
				<TabsList className="flex h-auto gap-1 w-full">
					<TabsTrigger value="notificacoes" className="flex-1">
						{t("settings.tabs.notifications")}
					</TabsTrigger>
					<TabsTrigger value="seguranca" className="flex-1">
						{t("settings.tabs.security")}
					</TabsTrigger>
					<TabsTrigger value="assinatura" className="flex-1">
						{t("settings.tabs.subscription")}
					</TabsTrigger>
					<TabsTrigger value="preferencias" className="flex-1">
						{t("settings.tabs.preferences")}
					</TabsTrigger>
				</TabsList>

				{/* Notifications */}
				<TabsContent value="notificacoes" className="space-y-4">
					<div className="bg-card border border-border rounded-xl p-6 space-y-1 divide-y divide-border">
						<SectionTitle>{t("settings.notifications.channels")}</SectionTitle>
						<SettingRow
							label={t("settings.notifications.emailNotifs")}
							description={t("settings.notifications.emailNotifsDesc")}
						>
							<Switch
								checked={notifs.email}
								onCheckedChange={() => toggleNotif("email")}
							/>
						</SettingRow>
						<SettingRow
							label={t("settings.notifications.pushNotifs")}
							description={t("settings.notifications.pushNotifsDesc")}
						>
							<Switch
								checked={notifs.push}
								onCheckedChange={() => toggleNotif("push")}
							/>
						</SettingRow>

						<div className="pt-4">
							<SectionTitle>{t("settings.notifications.events")}</SectionTitle>
						</div>
						<SettingRow
							label={t("settings.notifications.taskDue")}
							description={t("settings.notifications.taskDueDesc")}
						>
							<Switch
								checked={notifs.tarefas}
								onCheckedChange={() => toggleNotif("tarefas")}
							/>
						</SettingRow>
						<SettingRow
							label={t("settings.notifications.goalUpdates")}
							description={t("settings.notifications.goalUpdatesDesc")}
						>
							<Switch
								checked={notifs.metas}
								onCheckedChange={() => toggleNotif("metas")}
							/>
						</SettingRow>
						<SettingRow
							label={t("settings.notifications.weeklySummary")}
							description={t("settings.notifications.weeklySummaryDesc")}
						>
							<Switch
								checked={notifs.resumo}
								onCheckedChange={() => toggleNotif("resumo")}
							/>
						</SettingRow>
					</div>
				</TabsContent>

				{/* Security */}
				<TabsContent value="seguranca" className="space-y-4">
					<div className="bg-card border border-border rounded-xl p-6 space-y-4">
						<SectionTitle>{t("settings.security.changePassword")}</SectionTitle>
						<div className="space-y-3">
							<div className="space-y-1.5">
								<Label htmlFor="current-pw">
									{t("settings.security.currentPassword")}
								</Label>
								<Input id="current-pw" type="password" />
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="new-pw">
									{t("settings.security.newPassword")}
								</Label>
								<Input id="new-pw" type="password" />
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="confirm-pw">
									{t("settings.security.confirmPassword")}
								</Label>
								<Input id="confirm-pw" type="password" />
							</div>
							<div className="flex justify-end pt-1">
								<Button>{t("settings.security.updatePassword")}</Button>
							</div>
						</div>
					</div>

					<div className="bg-card border border-border rounded-xl p-6 divide-y divide-border space-y-1">
						<SectionTitle>
							{t("settings.security.additionalSecurity")}
						</SectionTitle>
						<SettingRow
							label={t("settings.security.twoFactor")}
							description={t("settings.security.twoFactorDesc")}
						>
							<Button variant="outline" size="sm">
								{t("settings.security.enable2FA")}
							</Button>
						</SettingRow>
						<SettingRow
							label={t("settings.security.activeSessions")}
							description={t("settings.security.activeSessionsDesc")}
						>
							<Button variant="outline" size="sm">
								{t("settings.security.manage")}
							</Button>
						</SettingRow>
					</div>
				</TabsContent>

				{/* Subscription */}
				<TabsContent value="assinatura" className="space-y-4">
					<div className="bg-card border border-border rounded-xl p-6 space-y-4">
						<SectionTitle>
							{t("settings.subscription.currentPlan")}
						</SectionTitle>
						<div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
							<div>
								<p className="font-semibold text-foreground">
									{t("settings.subscription.freePlan")}
								</p>
								<p className="text-sm text-muted-foreground">
									{t("settings.subscription.freePlanDesc")}
								</p>
							</div>
							<Button size="sm">{t("settings.subscription.upgrade")}</Button>
						</div>

						<Separator />
						<div className="space-y-2">
							<h4 className="text-sm font-semibold text-foreground">
								{t("settings.subscription.availablePlans")}
							</h4>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{(["pro", "family"] as const).map((key) => (
									<div
										key={key}
										className="border border-border rounded-lg p-4 space-y-2"
									>
										<div className="flex items-center justify-between">
											<span className="font-semibold text-foreground">
												{t(`settings.subscription.plans.${key}.name`)}
											</span>
											<span className="text-sm text-primary font-medium">
												{t(`settings.subscription.plans.${key}.price`)}
											</span>
										</div>
										<ul className="space-y-1">
											{(
												t(
													`settings.subscription.plans.${key}.features`,
													{ returnObjects: true },
												) as string[]
											).map((f) => (
												<li
													key={f}
													className="text-xs text-muted-foreground flex items-center gap-1.5"
												>
													<span className="w-1 h-1 rounded-full bg-primary inline-block" />
													{f}
												</li>
											))}
										</ul>
										<Button variant="outline" size="sm" className="w-full">
											{t("settings.subscription.subscribe")}
										</Button>
									</div>
								))}
							</div>
						</div>
					</div>
				</TabsContent>

				{/* Preferences */}
				<TabsContent value="preferencias" className="space-y-4">
					<div className="bg-card border border-border rounded-xl p-6 space-y-5">
						<SectionTitle>{t("settings.preferences.theme")}</SectionTitle>
						<div className="grid grid-cols-3 gap-3">
							{[
								{
									id: "light",
									labelKey: "settings.preferences.themeLight",
									icon: Sun,
								},
								{
									id: "dark",
									labelKey: "settings.preferences.themeDark",
									icon: Moon,
								},
								{
									id: "system",
									labelKey: "settings.preferences.themeSystem",
									icon: Monitor,
								},
							].map(({ id, labelKey, icon: Icon }) => (
								<button
									key={id}
									type="button"
									onClick={() => setTheme(id as "light" | "dark" | "system")}
									className={cn(
										"flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
										theme === id
											? "border-primary bg-primary/5"
											: "border-border hover:border-primary/40",
									)}
								>
									<Icon
										className={cn(
											"w-5 h-5",
											theme === id ? "text-primary" : "text-muted-foreground",
										)}
									/>
									<span
										className={cn(
											"text-sm font-medium",
											theme === id ? "text-primary" : "text-muted-foreground",
										)}
									>
										{t(labelKey)}
									</span>
								</button>
							))}
						</div>

						<Separator />
						<div className="space-y-1.5">
							<Label htmlFor="lang">{t("settings.preferences.language")}</Label>
							<Select value={i18n.language} onValueChange={handleLangChange}>
								<SelectTrigger className="w-48">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="pt-BR">Português (Brasil)</SelectItem>
									<SelectItem value="en">English</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Separator />
						<div className="space-y-3 divide-y divide-border">
							<SectionTitle>{t("settings.preferences.privacy")}</SectionTitle>
							<SettingRow
								label={t("settings.preferences.usageAnalytics")}
								description={t("settings.preferences.usageAnalyticsDesc")}
							>
								<Switch defaultChecked />
							</SettingRow>
						</div>

						<Separator />
						<div className="space-y-3">
							<h3 className="text-base font-semibold text-destructive">
								{t("settings.preferences.dangerZone")}
							</h3>
							<div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5">
								<div className="flex items-start gap-3">
									<AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
									<div className="flex-1">
										<p className="text-sm font-medium text-foreground">
											{t("settings.preferences.deleteAccount")}
										</p>
										<p className="text-xs text-muted-foreground mt-0.5">
											{t("settings.preferences.deleteAccountDesc")}
										</p>
									</div>
									<Button variant="destructive" size="sm">
										{t("settings.preferences.deleteAccount")}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
