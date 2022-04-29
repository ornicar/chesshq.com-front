import React, { useState } from "react";
import { ApolloConsumer } from "@apollo/client";
import ChessController from "../../controllers/ChessController";

import { DEMO_OPENING_RESULT } from "../../lib/constants/chess";
import { EcoPositionModel } from "../../lib/types/models/EcoPosition";
import Chessboard from "../Chessboard";

function OpeningsDemo() {
	const [ active_opening, setActiveOpening ] = useState<EcoPositionModel>(DEMO_OPENING_RESULT.ecoPositions[0]);
	const boards                               = [];

	for (const opening of DEMO_OPENING_RESULT.ecoPositions) {
		const classes = ["pr-2 lg:pr-0 overflow-ellipsis overflow-hidden relative"];

		if (active_opening.id === opening.id) {
			classes.push("active-border");
		}

		boards.push(
			<button key={"opening-link-" + opening.id} className="inline-block lg:block w-1/2 lg:w-full board-100w max-w-full lg:mb-4" onClick={() => setActiveOpening(opening)}>
				<h1 style={{ height : "44px", maxHeight : "44px", WebkitLineClamp : 2, WebkitBoxOrient : "vertical", display: "-webkit-box" }} className={classes.join(" ")}>
					{opening.code}: {opening.name}
				</h1>
				<Chessboard
					key={"opening-" + opening.id}
					mode="static"
					fen={opening.fen}
					pgn={opening.pgn}
					onMove={() => ""}
					queue_item={undefined}
					quizzing={false}
				/>
			</button>
		);
	}

	return (
		<div className="flex flex-wrap">
			<div className="flex-initial w-full lg:w-1/4 lg:pr-8">
				{boards}
			</div>
			<div className="flex-1 max-w-full lg:max-w-3/4">
				<ApolloConsumer>
					{client => 
						<ChessController
							key="chess-controller"
							demo={true}
							mode="database"
							client={client}
							game={active_opening}
							arrows={{}}
						/>
					}
				</ApolloConsumer>
			</div>
		</div>
	);
}

export default OpeningsDemo;