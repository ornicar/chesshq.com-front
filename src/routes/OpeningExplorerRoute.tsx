import React from "react";
import { ApolloConsumer } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import ChessController from "../controllers/ChessController";
import { createOpeningExplorerRouteMeta } from "../helpers";

function OpeningExplorerRoute() {
	const { t } = useTranslation("openings");
	const meta  = createOpeningExplorerRouteMeta(t);

	return (
		<>
			<Helmet>
				<title>{meta.title}</title>
				<meta name="description" content={meta.description}/>
				<link rel="canonical" href={meta.url}/>
				<meta property="og:title" content={meta.og_title}/>
				<meta property="og:description" content={meta.description}/>
				<meta property="og:url" content={meta.url}/>
				<meta property="twitter:title" content={meta.og_title}/>
				<meta property="twitter:description" content={meta.description}/>
			</Helmet>
			<ApolloConsumer>
				{client => 
					<ChessController
						demo={false}
						key="chess-controller"
						mode={"explorer"}
						client={client}
					/>
				}
			</ApolloConsumer>
		</>
	)
}

export default OpeningExplorerRoute;