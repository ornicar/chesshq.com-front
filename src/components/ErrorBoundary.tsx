import React, { ReactNode } from "react";
import { notifyError } from "../helpers";

class ErrorBoundary extends React.Component {
	componentDidCatch(error: unknown, info: unknown): void {
		notifyError();

		if (process.env.NODE_ENV === "development") {
			console.error(error);
			console.info(info);
		}
	}

	render(): ReactNode {
		return this.props.children;
	}
}

export default ErrorBoundary;