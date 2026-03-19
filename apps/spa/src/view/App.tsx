import "@/libs/i18n";
import { AuthProvider } from "@/contexts/auth";
import { QueryClientProvider } from "@/libs/query";
import { ThemeProvider } from "@repo/ui/providers";
import { Toaster } from "@repo/ui/sonner";
import { Router } from "./router/browser";

function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="spa-ui-theme">
			<QueryClientProvider>
				<AuthProvider>
					<Toaster position="top-right" />
					<Router />
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
