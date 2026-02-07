import { SettingsNotificationsTab } from "@/modules/settings/view/components/tabs/notifications-tab";
import { SettingsProfileTab } from "@/modules/settings/view/components/tabs/profile-tab";
import { SettingsSecurityTab } from "@/modules/settings/view/components/tabs/security-tab";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import { Label } from "@repo/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/select";
import { Switch } from "@repo/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { CreditCard, Download, Save, Trash2 } from "lucide-react";

export function Settings() {
	return (
		<div className="flex-1 p-8">
			<div className="space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold text-balance">Settings</h1>
						<p className="mt-1 text-muted-foreground">
							Manage your account preferences and configuration
						</p>
					</div>
				</div>

				<Tabs
					defaultValue="profile"
					className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pb-16"
				>
					<TabsList className="grid w-full grid-cols-5">
						<TabsTrigger value="profile">Profile</TabsTrigger>
						<TabsTrigger value="notifications">Notifications</TabsTrigger>
						<TabsTrigger value="security">Security</TabsTrigger>
						<TabsTrigger value="billing">Billing</TabsTrigger>
						<TabsTrigger value="preferences">Preferences</TabsTrigger>
					</TabsList>

					<TabsContent value="profile" className="space-y-6">
						<SettingsProfileTab />
					</TabsContent>

					<TabsContent value="notifications" className="space-y-6">
						<SettingsNotificationsTab />
					</TabsContent>

					<TabsContent value="security" className="space-y-6">
						<SettingsSecurityTab />
					</TabsContent>

					<TabsContent value="billing" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Billing & Subscription</CardTitle>
								<CardDescription>
									Manage your subscription and billing information
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									<h3 className="font-medium ">Current Plan</h3>
									<div className="p-4 border ounded-lg">
										<div className="flex items-center justify-between mb-2">
											<div className="font-medium text-lg">Pro Plan</div>
											<Badge
												variant="secondary"
												className="bg-purple-100 text-purple-700"
											>
												Active
											</Badge>
										</div>
										<div className="text-sm text-muted-foreground mb-4">
											$29/month • Billed monthly • Next billing: Jan 15, 2025
										</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm">
												Change Plan
											</Button>
											<Button variant="outline" size="sm">
												Cancel Subscription
											</Button>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<h3 className="font-medium ">Payment Method</h3>
									<div className="p-4 border rounded-lg">
										<div className="flex items-center gap-3 mb-2">
											<CreditCard className="w-5 h-5 text-gray-400" />
											<div className="font-medium">•••• •••• •••• 4242</div>
											<Badge variant="secondary">Default</Badge>
										</div>
										<div className="text-sm text-muted-foreground mb-4">
											Expires 12/2027
										</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm">
												Update Card
											</Button>
											<Button variant="outline" size="sm">
												Add Payment Method
											</Button>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<h3 className="font-medium ">Billing History</h3>
									<div className="space-y-2">
										<div className="flex items-center justify-between p-3 border rounded-lg">
											<div>
												<div className="font-medium">Dec 15, 2024</div>
												<div className="text-sm text-muted-foreground">
													Pro Plan - Monthly
												</div>
											</div>
											<div className="flex items-center gap-2">
												<span className="font-medium">$29.00</span>
												<Button variant="ghost" size="sm">
													<Download className="w-4 h-4" />
												</Button>
											</div>
										</div>

										<div className="flex items-center justify-between p-3 border rounded-lg">
											<div>
												<div className="font-medium">Nov 15, 2024</div>
												<div className="text-sm text-muted-foreground">
													Pro Plan - Monthly
												</div>
											</div>
											<div className="flex items-center gap-2">
												<span className="font-medium">$29.00</span>
												<Button variant="ghost" size="sm">
													<Download className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="preferences" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Application Preferences</CardTitle>
								<CardDescription>
									Customize your application experience
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									<h3 className="font-medium ">Appearance</h3>
									<div className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="theme">Theme</Label>
											<Select defaultValue="light">
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="light">Light</SelectItem>
													<SelectItem value="dark">Dark</SelectItem>
													<SelectItem value="system">System</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2">
											<Label htmlFor="language">Language</Label>
											<Select defaultValue="en">
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="en">English</SelectItem>
													<SelectItem value="es">Spanish</SelectItem>
													<SelectItem value="fr">French</SelectItem>
													<SelectItem value="de">German</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<h3 className="font-medium ">Data & Privacy</h3>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div>
												<div className="font-medium">
													Analytics & Usage Data
												</div>
												<div className="text-sm text-muted-foreground">
													Help improve our product by sharing usage data
												</div>
											</div>
											<Switch defaultChecked />
										</div>

										<div className="flex items-center justify-between">
											<div>
												<div className="font-medium">
													Marketing Communications
												</div>
												<div className="text-sm text-muted-foreground">
													Receive product updates and marketing emails
												</div>
											</div>
											<Switch />
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<h3 className="font-medium ">Data Export</h3>
									<div className="space-y-4">
										<p className="text-sm text-muted-foreground">
											Export your data including workflows, logs, and account
											information.
										</p>
										<Button variant="outline" className="gap-2 bg-transparent">
											<Download className="w-4 h-4" />
											Export Data
										</Button>
									</div>
								</div>

								<div className="space-y-4">
									<h3 className="font-medium text-red-600">Danger Zone</h3>
									<div className="p-4 border rounded-lg">
										<div className="space-y-4">
											<div>
												<div className="font-medium ">Delete Account</div>
												<div className="text-sm text-red-700">
													Permanently delete your account and all associated
													data. This action cannot be undone.
												</div>
											</div>
											<Button variant="destructive" className="gap-2">
												<Trash2 className="w-4 h-4" />
												Delete Account
											</Button>
										</div>
									</div>
								</div>

								<div className="flex justify-end">
									<Button className="gap-2">
										<Save className="w-4 h-4" />
										Save Preferences
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
