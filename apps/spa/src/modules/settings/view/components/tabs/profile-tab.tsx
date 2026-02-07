import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
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
import { Textarea } from "@repo/ui/textarea";
import { Save, Upload } from "lucide-react";

export function SettingsProfileTab() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile Information</CardTitle>
				<CardDescription>
					Update your personal information and profile settings
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex items-center gap-6">
					<Avatar className="w-20 h-20">
						<AvatarImage src="/placeholder.svg?height=80&width=80" />
						<AvatarFallback className="text-lg">AE</AvatarFallback>
					</Avatar>
					<div className="space-y-2">
						<Button variant="outline" className="gap-2 bg-transparent">
							<Upload className="w-4 h-4" />
							Upload Photo
						</Button>
						<p className="text-sm text-muted-foreground">
							JPG, PNG or GIF. Max size 2MB.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<Label htmlFor="firstName">First Name</Label>
						<Input id="firstName" defaultValue="Alex" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="lastName">Last Name</Label>
						<Input id="lastName" defaultValue="Evans" />
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">Email Address</Label>
					<Input id="email" type="email" defaultValue="alex@company.com" />
				</div>

				<div className="space-y-2">
					<Label htmlFor="phone">Phone Number</Label>
					<Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
				</div>

				<div className="space-y-2">
					<Label htmlFor="bio">Bio</Label>
					<Textarea
						id="bio"
						placeholder="Tell us about yourself..."
						defaultValue="Product manager passionate about automation and workflow optimization."
						rows={3}
					/>
				</div>

				<div className="flex justify-end">
					<Button className="gap-2">
						<Save className="w-4 h-4" />
						Save Changes
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
