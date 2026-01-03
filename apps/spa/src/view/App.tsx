import { QueryClientProvider } from "@/libs/query";
import { ThemeProvider } from "@repo/ui/providers";
import { Router } from "./router/browser";

function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="spa-ui-theme">
			<QueryClientProvider>
				<Router />
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
