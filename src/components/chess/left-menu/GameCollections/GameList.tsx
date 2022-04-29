import React from "react";
import { useHistory } from "react-router-dom";
import { Table } from "antd";
import { useTranslation } from "react-i18next";

import { CollectionModel } from "../../../../lib/types/models/Collection";
import Game from "./GameList/Game";
import { ChessControllerProps } from "../../../../lib/types/ChessControllerTypes";

interface GameListProps {
	collection_slug: CollectionModel["slug"],
	games: CollectionModel["games"],
	game: ChessControllerProps["game"]
}

function GameList(props: GameListProps) {
	const { t } = useTranslation("common");
	const history = useHistory();

	return (
		<div className="w-full">
			<Table
				dataSource={props.games ?? []}
				pagination={{ pageSize : 10 }}
				rowClassName="cursor-pointer"
				showHeader={false}
				locale={{
					emptyText : t("na")
				}}
				rowKey={(record) => "game-list-item-" + record.id}
				onRow={(record) => {
					return {
						onClick : () => {
							history.push("/game-database/collection/" + props.collection_slug + "/game/" + record.id);
						}
					}
				}}
			>
				<Table.Column
					render={(_text, record: any) => {
						return <Game game={record} active={props.game?.id === record.id}/>
					}}
				/>
			</Table>
		</div>
	);
}

export default GameList;