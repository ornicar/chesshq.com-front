import React from "react";
import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import Search from "../Search";

interface PublicRepertoiresProps {
	movelist            : string,
	repertoire?         : ChessControllerProps["repertoire"],
	onMoveSearchChange? : Function
}

function PublicRepertoires(props: PublicRepertoiresProps) {
	return (
		<Search mode="repertoires" onMoveSearchChange={props.onMoveSearchChange} movelist={props.movelist} record={props.repertoire}/>
	);
}

export default PublicRepertoires;