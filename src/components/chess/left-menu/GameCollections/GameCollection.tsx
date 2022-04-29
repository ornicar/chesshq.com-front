import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChess } from "@fortawesome/free-solid-svg-icons";

import { CollectionModel } from "../../../../lib/types/models/Collection";

interface GameCollectionProps {
	collection : CollectionModel
}

function GameCollection(props: GameCollectionProps) {
	const { t } = useTranslation(["database", "chess"]);

	return (
		<Link to={{ pathname: "/game-database/collection/" + props.collection.slug }} className="flex">
			<div className="flex pr-2 flex-1 overflow-hidden">
				<span className="overflow-hidden overflow-ellipsis">{props.collection.name}</span>
			</div>
			<div className="flex flex-initial items-center">
				<FontAwesomeIcon icon={faChess} size="xs" className="mr-1"/>
				{props.collection.gameCount} {t("chess:game", { count: props.collection.gameCount })}
			</div>
		</Link>
	)
}

export default GameCollection;