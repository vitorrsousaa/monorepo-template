import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { useState } from "react";

export function SettingsSecurityTab() {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Security Settings</CardTitle>
				<CardDescription>
					Manage your account security and authentication
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<h3 className="font-medium ">Password</h3>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="currentPassword">Current Password</Label>
							<div className="relative">
								<Input
									id="currentPassword"
									type={showPassword ? "text" : "password"}
									placeholder="Enter current password"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
									)}
								</Button>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="newPassword">New Password</Label>
							<Input
								id="newPassword"
								type="password"
								placeholder="Enter new password"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm New Password</Label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="Confirm new password"
							/>
						</div>

						<Button variant="outline" className="gap-2 bg-transparent">
							<Lock className="w-4 h-4" />
							Update Password
						</Button>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="font-medium ">Two-Factor Authentication</h3>
					<div className="flex items-center justify-between p-4 border rounded-lg">
						<div>
							<div className="font-medium">Authenticator App</div>
							<div className="text-sm text-muted-foreground">
								Use an authenticator app for additional security
							</div>
						</div>
						<Badge variant="secondary" className="bg-red-100 text-red-700">
							Disabled
						</Badge>
					</div>
					<Button variant="outline" className="gap-2 bg-transparent">
						<Shield className="w-4 h-4" />
						Enable 2FA
					</Button>
				</div>

				<div className="space-y-4">
					<h3 className="font-medium ">Active Sessions</h3>
					<div className="space-y-3">
						<div className="flex items-center justify-between p-4 border rounded-lg">
							<div>
								<div className="font-medium">Current Session</div>
								<div className="text-sm text-muted-foreground">
									Chrome on macOS • San Francisco, CA
								</div>
								<div className="text-xs text-gray-500">Last active: Now</div>
							</div>
							<Badge
								variant="secondary"
								className="bg-green-100 text-green-700"
							>
								Current
							</Badge>
						</div>

						<div className="flex items-center justify-between p-4 border rounded-lg">
							<div>
								<div className="font-medium">Mobile App</div>
								<div className="text-sm text-muted-foreground">
									iPhone • San Francisco, CA
								</div>
								<div className="text-xs text-gray-500">
									Last active: 2 hours ago
								</div>
							</div>
							<Button variant="outline" size="sm">
								Revoke
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
