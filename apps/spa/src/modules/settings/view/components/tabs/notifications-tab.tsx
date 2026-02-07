import { Button } from "@repo/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import { Switch } from "@repo/ui/switch";
import { Bell, Mail, Save, Smartphone } from "lucide-react";
import { useState } from "react";

export function SettingsNotificationsTab() {
	const [notifications, setNotifications] = useState({
		email: true,
		push: false,
		sms: false,
		workflowSuccess: true,
		workflowFailure: true,
		weeklyReport: true,
		securityAlerts: true,
	});

	const handleNotificationChange = (key: string, value: boolean) => {
		setNotifications((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Notification Preferences</CardTitle>
				<CardDescription>
					Choose how you want to be notified about important events
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<h3 className="font-medium ">Notification Channels</h3>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Mail className="w-5 h-5 text-gray-400" />
								<div>
									<div className="font-medium">Email Notifications</div>
									<div className="text-sm text-muted-foreground">
										Receive notifications via email
									</div>
								</div>
							</div>
							<Switch
								checked={notifications.email}
								onCheckedChange={(value) =>
									handleNotificationChange("email", value)
								}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Bell className="w-5 h-5 text-gray-400" />
								<div>
									<div className="font-medium">Push Notifications</div>
									<div className="text-sm text-muted-foreground">
										Receive browser push notifications
									</div>
								</div>
							</div>
							<Switch
								checked={notifications.push}
								onCheckedChange={(value) =>
									handleNotificationChange("push", value)
								}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Smartphone className="w-5 h-5 text-gray-400" />
								<div>
									<div className="font-medium">SMS Notifications</div>
									<div className="text-sm text-muted-foreground">
										Receive text message alerts
									</div>
								</div>
							</div>
							<Switch
								checked={notifications.sms}
								onCheckedChange={(value) =>
									handleNotificationChange("sms", value)
								}
							/>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="font-medium ">Event Notifications</h3>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium">Workflow Success</div>
								<div className="text-sm text-muted-foreground">
									When workflows complete successfully
								</div>
							</div>
							<Switch
								checked={notifications.workflowSuccess}
								onCheckedChange={(value) =>
									handleNotificationChange("workflowSuccess", value)
								}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium">Workflow Failure</div>
								<div className="text-sm text-muted-foreground">
									When workflows fail or encounter errors
								</div>
							</div>
							<Switch
								checked={notifications.workflowFailure}
								onCheckedChange={(value) =>
									handleNotificationChange("workflowFailure", value)
								}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium">Weekly Reports</div>
								<div className="text-sm text-muted-foreground">
									Weekly summary of workflow performance
								</div>
							</div>
							<Switch
								checked={notifications.weeklyReport}
								onCheckedChange={(value) =>
									handleNotificationChange("weeklyReport", value)
								}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium">Security Alerts</div>
								<div className="text-sm text-muted-foreground">
									Important security and account notifications
								</div>
							</div>
							<Switch
								checked={notifications.securityAlerts}
								onCheckedChange={(value) =>
									handleNotificationChange("securityAlerts", value)
								}
							/>
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
	);
}
