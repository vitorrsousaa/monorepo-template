"use client";

import { ThemeProvider } from "@repo/ui/providers";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider defaultTheme="system" storageKey="web-ui-theme">
			{children}
		</ThemeProvider>
	);
}
