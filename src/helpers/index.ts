import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";
import { notification } from "antd";

import i18n from "../i18n";

export * from "./chess";
export * from "./meta";
export * from "./routing";

export function hasPremiumLockoutError(error?: ApolloError | readonly GraphQLError[]) {
	if (!error) {
		return false;
	}

	const errors = (error instanceof ApolloError) ? error.graphQLErrors : error;

	for (const e of errors) {
		if (e.extensions?.code >= 200000 && e.extensions?.code < 300000) {
			return true;
		}
	}

	return false;
}

export function formateDate(date: string) {
	if (!date) {
		return null;
	}

	let missing_year    = false;
	let missing_month   = false;
	let missing_day     = false;
	const unknown_year  = "????";
	const unknown_month = "-??-";
	const unknown_day   = "-??";

	if (date.indexOf(unknown_year) !== -1) {
		missing_year = true;
		date         = date.replace(unknown_year, "2199");
	}

	if (date.indexOf(unknown_month) !== -1) {
		missing_month = true;
		date          = date.replace(unknown_month, "-11-");
	}

	if (date.indexOf(unknown_day) !== -1) {
		missing_day = true;
		date        = date.replace(unknown_day, "-28");
	}

	date = (new Date(date)).toLocaleDateString();

	if (missing_year) {
		date = date.replace(/\b2199\b/, "????");
	}

	if (missing_month) {
		date = date.replace(/\b11\b/, "??");
	}

	if (missing_day) {
		date = date.replace(/\b28\b/, "??");
	}

	return date;
}

export function notifyError(code?: string) {
	const duration = (process.env.NODE_ENV === "development") ? 0 : 4.5;

	if (code && ["100002", "100003", "100004", "300102"].includes(code)) {
		code = "100001";
	}

	notification.error({
		message  : (code && i18n.exists("errors:" + code)) ? i18n.t("errors:" + code) : i18n.t("errors:unexpected"),
		duration : duration
	});
}