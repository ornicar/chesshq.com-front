import React from "react";
import ReactDOM from "react-dom";

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import i18n from "./i18n";
import FirebaseAuth from "./lib/Firebase";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";

import { ApolloProvider } from "@apollo/client";
import store from "./redux/store";
import { Provider } from "react-redux";
import { client } from "./lib/Apollo";
import CacheBuster from "./components/CacheBuster";

FirebaseAuth();
i18n.setDefaultNamespace("common");

(async () => {
	ReactDOM.render(
		<React.StrictMode>
			<Provider store={store}>
				<ApolloProvider client={client}>
					<CacheBuster/>
					<App />
				</ApolloProvider>
			</Provider>
		</React.StrictMode>,
		document.getElementById("root")
	);
})();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
