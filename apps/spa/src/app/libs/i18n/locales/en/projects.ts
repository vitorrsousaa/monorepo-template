export default {
	form: {
		nameLabel: "Project Name",
		namePlaceholder: "e.g., Work, Personal, Health...",
		descriptionLabel: "Description",
		descriptionOptional: "(optional)",
		descriptionPlaceholder: "Add a description for this project...",
		colorLabel: "Project Color",
		selectedColor: "Selected color:",
		colors: {
			"#7F77DD": "Professional",
			"#1D9E75": "Home / Personal",
			"#378ADD": "Studies",
			"#F0952A": "Health / Habits",
			"#A86CC8": "Personal",
			"#D4537E": "Creative",
			"#1B9E99": "Technical",
			"#D94848": "Urgent",
			"#888780": "General",
		},
	},

	error: {
		title: "Error loading project",
		desc: "Could not load this project. Check your connection and try again.",
	},

	allProjects: {
		title: "All projects",
		count_one: "{{count}} project total",
		count_other: "{{count}} projects total",
		newProject: "New project",
		searchPlaceholder: "Search project...",
		filters: {
			all: "All",
			active: "Active",
			completed: "Completed",
		},
		status: {
			active: "Active",
			completed: "Completed",
		},
		card: {
			tasksOf: "{{done}} of {{total}} tasks",
			finished: "Finished",
			remaining_one: "{{count}} remaining",
			remaining_other: "{{count}} remaining",
			viewProject: "View project",
			viewActivity: "View activity",
			deleteProject: "Delete project",
			saving: "Saving...",
			saveFailed: "Failed to save",
			retry: "Try again",
		},
		empty: {
			title: "No projects found",
			filteredDesc: "Try a different search term or filter",
			emptyDesc: "Create a project to get started",
		},
		errorState: {
			title: "Error loading projects",
			desc: "Could not load your projects. Please try again.",
			retry: "Try again",
		},
	},
};
