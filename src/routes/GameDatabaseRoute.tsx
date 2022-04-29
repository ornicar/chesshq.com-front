import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ApolloConsumer, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import ChessController from "../controllers/ChessController";
import { CollectionQueryData } from "../lib/types/models/Collection";
import { GET_COLLECTION, GET_GAME, GET_MASTER_GAME } from "../api/queries";
import { MasterGameQueryData } from "../lib/types/models/MasterGame";
import { GameQueryData } from "../lib/types/models/Game";
import { createGameDatabaseRouteMeta } from "../helpers";
import { ChessState } from "../lib/types/ReduxTypes";
import { setCollection } from "../redux/slices/chess";
import { connect, ConnectedProps } from "react-redux";

interface GameDatabaseRouteParams {
	collection_slug?: string
	game_id?: string
	master_game_id?: string
}

function GameDatabaseRoute(props: PropsFromRedux) {
	const { t } = useTranslation(["database", "chess"]);
	const { collection_slug, game_id, master_game_id } = useParams<GameDatabaseRouteParams>();
	const [ move_searching, setMoveSearching ] = useState<boolean>(false);

	const { data } = useQuery<CollectionQueryData>(
		GET_COLLECTION,
		{
			variables : {
				slug : collection_slug
			},
			skip : !collection_slug
		}
	);

	const { data: master_game_data } = useQuery<MasterGameQueryData>(
		GET_MASTER_GAME,
		{
			variables : {
				id : master_game_id
			},
			skip : !master_game_id
		}
	);

	const { data: game_data } = useQuery<GameQueryData>(
		GET_GAME,
		{
			variables : {
				id : game_id
			},
			skip : !game_id
		}
	);

	const onMoveSearchChange = function(new_state: boolean) {
		setMoveSearching(new_state);
	}

	props.setCollection(data?.collection);

	const meta = createGameDatabaseRouteMeta(t, data?.collection, game_data?.game, master_game_data?.masterGame);

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
						mode={(move_searching) ? "search" : "database"}
						collection={data?.collection}
						game={game_data?.game ?? master_game_data?.masterGame}
						client={client}
						onMoveSearchChange={onMoveSearchChange}
					/>
				}
			</ApolloConsumer>
		</>
	)
}

const mapDispatchToProps = {
	setCollection : (collection: ChessState["collection"]) => setCollection(collection)
};
const connector      = connect(undefined, mapDispatchToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(GameDatabaseRoute);