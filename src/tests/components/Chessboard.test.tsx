import React from "react";
import { mount } from "@cypress/react";
import Chessboard from "../../components/Chessboard";

require("@cypress/snapshot").register();

it("Board loads white orientation", () => {
	mount(
		<Chessboard
			mode="database"
			orientation="white"
			onMove={() => null}
			children={[]}
			queue_item={null}
			quizzing={false}
		/>
	)
	.then(() => {
		cy.wait(1000);
		cy.get("body").first().snapshot();
	});
});

it("Board loads black orientation", () => {
	mount(
		<Chessboard
			mode="database"
			orientation="black"
			onMove={() => null}
			children={[]}
			queue_item={null}
			quizzing={false}
		/>
	)
	.then(() => {
		cy.wait(1000);
		cy.get("body").first().snapshot();
	});
});

it("Board populates correct FEN position", () => {
	mount(
		<Chessboard
			mode="database"
			orientation="white"
			fen="rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
			pgn="1. e4 c5"
			onMove={() => null}
			children={[]}
			queue_item={null}
			quizzing={false}
		/>
	)
	.then(() => {
		cy.wait(1000);
		cy.get("body").first().snapshot();
	});
});

it("Black and white captures appear correctly", () => {
	mount(
		<Chessboard
			mode="database"
			orientation="white"
			fen="rnbBkbnr/pppp1p1p/8/8/3p4/8/PPP1PPPP/RN1QKBNR w KQkq - 0 4"
			pgn="1. d4 g5 2. Bxg5 e5 3. Bxd8 exd4"
			onMove={() => null}
			children={[]}
			queue_item={null}
			quizzing={false}
		/>
	)
	.then(() => {
		cy.wait(1000);
		cy.get("body").first().snapshot();
	});
});