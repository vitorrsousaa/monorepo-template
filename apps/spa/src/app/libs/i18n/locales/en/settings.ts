export default {
	title: "Settings",
	subtitle: "Notifications, security, subscription and preferences",

	tabs: {
		notifications: "Notifications",
		security: "Security",
		subscription: "Subscription",
		preferences: "Preferences",
	},

	notifications: {
		channels: "Channels",
		emailNotifs: "Email notifications",
		emailNotifsDesc: "Receive updates in your email",
		pushNotifs: "Push notifications",
		pushNotifsDesc: "Browser notifications",
		events: "Events",
		taskDue: "Task due dates",
		taskDueDesc: "Alerts when a task is about to expire",
		goalUpdates: "Goal updates",
		goalUpdatesDesc: "Track goal progress",
		weeklySummary: "Weekly summary",
		weeklySummaryDesc: "Productivity summary every Monday",
	},

	security: {
		changePassword: "Change password",
		currentPassword: "Current password",
		newPassword: "New password",
		confirmPassword: "Confirm new password",
		updatePassword: "Update password",
		additionalSecurity: "Additional security",
		twoFactor: "Two-factor authentication",
		twoFactorDesc: "Add an extra layer of security",
		enable2FA: "Enable 2FA",
		activeSessions: "Active sessions",
		activeSessionsDesc: "1 device logged in",
		manage: "Manage",
	},

	subscription: {
		currentPlan: "Current plan",
		freePlan: "Free Plan",
		freePlanDesc: "Unlimited projects, up to 5 goals",
		upgrade: "Upgrade",
		availablePlans: "Available plans",
		subscribe: "Subscribe",
		plans: {
			pro: {
				name: "Pro",
				price: "$19/month",
				features: ["Unlimited goals", "Integrations", "Priority support"],
			},
			family: {
				name: "Family",
				price: "$39/month",
				features: ["5 users", "Shared calendar", "Everything in Pro"],
			},
		},
	},

	preferences: {
		theme: "Theme",
		themeLight: "Light",
		themeDark: "Dark",
		themeSystem: "System",
		language: "Language",
		privacy: "Privacy",
		usageAnalytics: "Usage analytics",
		usageAnalyticsDesc: "Help improve LifeOS by sharing anonymous data",
		dangerZone: "Danger zone",
		deleteAccount: "Delete account",
		deleteAccountDesc:
			"This action is permanent and cannot be undone. All your data will be removed.",
	},
};
