import React from "react";
import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import Search from "../Search";

interface MasterGamesProps {
	movelist            : string,
	game?               : ChessControllerProps["game"],
	onMoveSearchChange? : Function
}

function MasterGames(props: MasterGamesProps) {
	return (
		<Search mode="master_games" onMoveSearchChange={props.onMoveSearchChange} movelist={props.movelist} record={props.game}/>
	);
}

export default MasterGames;