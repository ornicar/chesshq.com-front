import { TYPES as GRAPHQL_TYPES } from "../api/types";
import { hasPremiumLockoutError, notifyError } from "../helpers";

import ActionCable from "actioncable";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink"
import { ApolloLink, ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const SOCKET_SCHEMA = (process.env.NODE_ENV === "development") ? "wss" : "wss";
const URL_SCHEMA    = (process.env.NODE_ENV === "development") ? "https" : "https";

const cable          = ActionCable.createConsumer(SOCKET_SCHEMA + "://" + process.env.REACT_APP_API_ADDRESS + "/cable")
const http_link      = createHttpLink({ uri: URL_SCHEMA + "://" + process.env.REACT_APP_API_ADDRESS + "/graphql" });
const shouldUseCable = () => {
	return true;
};
const error_link = onError(({ graphQLErrors }) => {
	if (graphQLErrors) {
		if (hasPremiumLockoutError(graphQLErrors)) {
			return;
		}

		notifyError(graphQLErrors[0].extensions?.code);

		if (process.env.NODE_ENV === "development") {
			console.error(graphQLErrors);
		}
	}
});

export const cable_link = new ActionCableLink({cable, connectionParams: { token : localStorage.getItem("firebase_token") }});

const link = ApolloLink.split(
	shouldUseCable,
	cable_link,
	http_link,
);

export const client = new ApolloClient({
	link     : from([error_link, link]),
	cache    : new InMemoryCache(),
	typeDefs : GRAPHQL_TYPES
});