import { QueryClientProvider } from "@/libs/query";
import { Router } from "./router/browser";

function App() {
	return (
		<QueryClientProvider>
			<Router />
		</QueryClientProvider>
	);
}

export default App;
