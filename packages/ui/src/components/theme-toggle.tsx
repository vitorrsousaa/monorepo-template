import * as React from "react";
import { useTheme } from "../providers/theme-provider";
import { Button } from "./button";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		if (theme === "light") {
			setTheme("dark");
		} else if (theme === "dark") {
			setTheme("system");
		} else {
			setTheme("light");
		}
	};

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={toggleTheme}
			aria-label="Toggle theme"
		>
			{theme === "light" && "☀️"}
			{theme === "dark" && "🌙"}
			{theme === "system" && "💻"}
		</Button>
	);
}
