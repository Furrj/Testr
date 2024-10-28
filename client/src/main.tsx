import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App.tsx";
import "./index.scss";
import "./styles/themes.scss";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UserProvider from "./contexts/UserProvider.tsx";
import UIProvider from "./contexts/UIProvider.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<UIProvider>
				<UserProvider>
					<ReactQueryDevtools initialIsOpen={false} />
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</UserProvider>
			</UIProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);
