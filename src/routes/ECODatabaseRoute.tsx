import React from "react";
import { Helmet } from "react-helmet";
import { ApolloConsumer, useQuery } from "@apollo/client";
import { GET_ECO } from "../api/queries";
import { EcoPositionQueryData } from "../lib/types/models/EcoPosition";
import ECODatabase from "../components/ECODatabase";
import { useTranslation } from "react-i18next";
import { createECODatabaseRouteMeta } from "../helpers";
import { useParams } from "react-router-dom";
import ChessController from "../controllers/ChessController";

interface ECODatabaseRouteParams {
	slug?: string
}

function ECODatabaseRoute() {
	const { slug }               = useParams<ECODatabaseRouteParams>();
	const { t }                  = useTranslation("openings");
	const { data: opening_data } = useQuery<EcoPositionQueryData>(
		GET_ECO,
		{
			variables : {
				slug : slug
			},
			skip : !slug
		}
	);

	const opening = opening_data?.ecoPosition;
	const meta    = createECODatabaseRouteMeta(t, opening);

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
			{!slug && <ECODatabase/>}
			{
				slug &&
				<ApolloConsumer>
					{client => 
						<ChessController
							demo={false}
							key="chess-controller"
							mode="opening"
							game={opening}
							client={client}
						/>
					}
				</ApolloConsumer>
			}
		</>
	);
}

export default ECODatabaseRoute;