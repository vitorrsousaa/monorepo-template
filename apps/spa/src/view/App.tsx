import { AuthProvider } from "@/contexts/auth";
import { QueryClientProvider } from "@/libs/query";
import { ThemeProvider } from "@repo/ui/providers";
import { Router } from "./router/browser";

function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="spa-ui-theme">
			<QueryClientProvider>
				<AuthProvider>
					<Router />
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
