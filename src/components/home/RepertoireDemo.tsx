import React, { useState } from "react";
import { ApolloConsumer } from "@apollo/client";

import ChessController from "../../controllers/ChessController";
import { generateUUID, getMoveSimple } from "../../helpers";
import { RepertoireModel, RepertoireMoveModel } from "../../lib/types/models/Repertoire";

const REPERTOIRE: RepertoireModel = {
	id: -1,
	name: "Demo",
	public: true,
	side: "white",
	slug: "demo",
	userOwned: true,
	moves: [
		{
			"id": "-1",
			"move": "e4",
			"moveNumber": 10,
			"sort": 0,
			"uci": "e2e4",
			"fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
		},
		{
			"id": "-2",
			"move": "e5",
			"parentId": "-1",
			"moveNumber": 15,
			"sort": 0,
			"uci": "e7e5",
			"fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
		},
		{
			"id": "-3",
			"move": "Nf3",
			"parentId": "-2",
			"moveNumber": 20,
			"sort": 0,
			"uci": "g1f3",
			"fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
		},
		{
			"id": "-4",
			"move": "Ke2",
			"parentId": "-2",
			"moveNumber": 20,
			"sort": 1,
			"uci": "e1e2",
			"fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPKPPP/RNBQ1BNR b kq - 1 2"
		},
		{
			"id": "-5",
			"move": "Nf6",
			"parentId": "-3",
			"moveNumber": 25,
			"sort": 0,
			"uci": "g8f6",
			"fen": "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
		},
		{
			"id": "-6",
			"move": "Bc4",
			"parentId": "-5",
			"moveNumber": 30,
			"sort": 0,
			"uci": "f1c4",
			"fen": "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"
		},
		{
			"id": "-46",
			"move": "Bc5",
			"parentId": "-6",
			"moveNumber": 35,
			"sort": 0,
			"uci": "f8c5",
			"fen": "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"
		},
		{
			"id": "-7",
			"move": "b4",
			"parentId": "-46",
			"moveNumber": 40,
			"sort": 0,
			"uci": "b2b4",
			"fen": "rnbqk2r/pppp1ppp/5n2/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq - 0 4"
		},
		{
			"id": "-8",
			"moveNumber": 15,
			"move": "c5",
			"fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
			"uci": "c7c5",
			"parentId": "-1",
			"sort": 2
		},
		{
			"id": "-9",
			"moveNumber": 20,
			"move": "Nf3",
			"fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
			"uci": "g1f3",
			"parentId": "-8",
			"sort": 3
		},
		{
			"id": "-10",
			"moveNumber": 25,
			"move": "d6",
			"fen": "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
			"uci": "d7d6",
			"parentId": "-9",
			"sort": 4
		},
		{
			"id": "-11",
			"moveNumber": 30,
			"move": "d4",
			"fen": "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
			"uci": "d2d4",
			"parentId": "-10",
			"sort": 5
		},
		{
			"id": "-12",
			"moveNumber": 35,
			"move": "cxd4",
			"fen": "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
			"uci": "c5d4",
			"parentId": "-11",
			"sort": 6
		},
		{
			"id": "-13",
			"moveNumber": 40,
			"move": "Nxd4",
			"fen": "rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
			"uci": "f3d4",
			"parentId": "-12",
			"sort": 7
		},
		{
			"id": "-14",
			"moveNumber": 15,
			"move": "e6",
			"fen": "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
			"uci": "e7e6",
			"parentId": "-1",
			"sort": 8
		},
		{
			"id": "-15",
			"moveNumber": 20,
			"move": "d4",
			"fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
			"uci": "d2d4",
			"parentId": "-14",
			"sort": 9
		},
		{
			"id": "-16",
			"moveNumber": 25,
			"move": "d5",
			"fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
			"uci": "d7d5",
			"parentId": "-15",
			"sort": 10
		},
		{
			"id": "-17",
			"moveNumber": 30,
			"move": "Nc3",
			"fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
			"uci": "b1c3",
			"parentId": "-16",
			"sort": 11
		},
		{
			"id": "-18",
			"moveNumber": 35,
			"move": "Nf6",
			"fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4",
			"uci": "g8f6",
			"parentId": "-17",
			"sort": 12
		},
		{
			"id": "-19",
			"moveNumber": 25,
			"move": "Nc6",
			"fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
			"uci": "b8c6",
			"parentId": "-3",
			"sort": 13
		},
		{
			"id": "-20",
			"moveNumber": 30,
			"move": "Bb5",
			"fen": "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
			"uci": "f1b5",
			"parentId": "-19",
			"sort": 14
		},
		{
			"id": "-21",
			"moveNumber": 35,
			"move": "Nf6",
			"fen": "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
			"uci": "g8f6",
			"parentId": "-20",
			"sort": 15
		},
		{
			"id": "-22",
			"moveNumber": 40,
			"move": "d3",
			"fen": "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4",
			"uci": "d2d3",
			"parentId": "-21",
			"sort": 16
		},
		{
			"id": "-23",
			"moveNumber": 15,
			"move": "c6",
			"fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
			"uci": "c7c6",
			"parentId": "-1",
			"sort": 17
		},
		{
			"id": "-24",
			"moveNumber": 20,
			"move": "d4",
			"fen": "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
			"uci": "d2d4",
			"parentId": "-23",
			"sort": 18
		},
		{
			"id": "-25",
			"moveNumber": 25,
			"move": "d5",
			"fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
			"uci": "d7d5",
			"parentId": "-24",
			"sort": 19
		},
		{
			"id": "-26",
			"moveNumber": 30,
			"move": "e5",
			"fen": "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
			"uci": "e4e5",
			"parentId": "-25",
			"sort": 20
		},
		{
			"id": "-27",
			"moveNumber": 35,
			"move": "Bf5",
			"fen": "rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4",
			"uci": "c8f5",
			"parentId": "-26",
			"sort": 21
		},
		{
			"id": "-28",
			"moveNumber": 40,
			"move": "h4",
			"fen": "rn1qkbnr/pp2pppp/2p5/3pPb2/3P3P/8/PPP2PP1/RNBQKBNR b KQkq - 0 4",
			"uci": "h2h4",
			"parentId": "-27",
			"sort": 22
		},
		{
			"id": "-29",
			"moveNumber": 30,
			"move": "Bc4",
			"fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
			"uci": "f1c4",
			"parentId": "-19",
			"sort": 23
		},
		{
			"id": "-30",
			"moveNumber": 35,
			"move": "Bc5",
			"fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
			"uci": "f8c5",
			"parentId": "-29",
			"sort": 24
		},
		{
			"id": "-31",
			"moveNumber": 40,
			"move": "c3",
			"fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4",
			"uci": "c2c3",
			"parentId": "-30",
			"sort": 25
		},
		{
			"id": "-32",
			"moveNumber": 20,
			"move": "Nc3",
			"fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2",
			"uci": "b1c3",
			"parentId": "-8",
			"sort": 26
		},
		{
			"id": "-33",
			"moveNumber": 25,
			"move": "d6",
			"fen": "rnbqkbnr/pp2pppp/3p4/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 3",
			"uci": "d7d6",
			"parentId": "-32",
			"sort": 27
		},
		{
			"id": "-34",
			"moveNumber": 30,
			"move": "g3",
			"fen": "rnbqkbnr/pp2pppp/3p4/2p5/4P3/2N3P1/PPPP1P1P/R1BQKBNR b KQkq - 0 3",
			"uci": "g2g3",
			"parentId": "-33",
			"sort": 28
		},
		{
			"id": "-35",
			"moveNumber": 35,
			"move": "Nc6",
			"fen": "r1bqkbnr/pp2pppp/2np4/2p5/4P3/2N3P1/PPPP1P1P/R1BQKBNR w KQkq - 1 4",
			"uci": "b8c6",
			"parentId": "-34",
			"sort": 29
		},
		{
			"id": "-36",
			"moveNumber": 40,
			"move": "Bg2",
			"fen": "r1bqkbnr/pp2pppp/2np4/2p5/4P3/2N3P1/PPPP1PBP/R1BQK1NR b KQkq - 2 4",
			"uci": "f1g2",
			"parentId": "-35",
			"sort": 30
		},
		{
			"id": "-37",
			"moveNumber": 30,
			"move": "d4",
			"fen": "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
			"uci": "d2d4",
			"parentId": "-19",
			"sort": 31
		},
		{
			"id": "-38",
			"moveNumber": 35,
			"move": "exd4",
			"fen": "r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
			"uci": "e5d4",
			"parentId": "-37",
			"sort": 32
		},
		{
			"id": "-39",
			"moveNumber": 40,
			"move": "Nxd4",
			"fen": "r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
			"uci": "f3d4",
			"parentId": "-38",
			"sort": 33
		},
		{
			"id": "-40",
			"moveNumber": 45,
			"move": "Bc5",
			"fen": "r1bqk1nr/pppp1ppp/2n5/2b5/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5",
			"uci": "f8c5",
			"parentId": "-39",
			"sort": 34
		},
		{
			"id": "-41",
			"moveNumber": 50,
			"move": "Nb3",
			"fen": "r1bqk1nr/pppp1ppp/2n5/2b5/4P3/1N6/PPP2PPP/RNBQKB1R b KQkq - 2 5",
			"uci": "d4b3",
			"parentId": "-40",
			"sort": 35
		},
		{
			"id": "-42",
			"moveNumber": 15,
			"move": "d6",
			"fen": "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
			"uci": "d7d6",
			"parentId": "-1",
			"sort": 36
		},
		{
			"id": "-43",
			"moveNumber": 20,
			"move": "d4",
			"fen": "rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
			"uci": "d2d4",
			"parentId": "-42",
			"sort": 37
		},
		{
			"id": "-44",
			"moveNumber": 25,
			"move": "Nf6",
			"fen": "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3",
			"uci": "g8f6",
			"parentId": "-43",
			"sort": 38
		},
		{
			"id": "-45",
			"moveNumber": 30,
			"move": "Nc3",
			"fen": "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
			"uci": "b1c3",
			"parentId": "-44",
			"sort": 39
		}
	]
};

let next_sort = 2;

function RepertoireDemo() {
	const [ repertoire, setRepertoire ] = useState(REPERTOIRE);
	const id_map: {[old_id: string]: string} = {};

	for (let i = 0; i < REPERTOIRE.moves!.length; i++) {
		const move      = REPERTOIRE.moves![i];
		const id        = move.id;
		const parent_id = move.parentId;

		if (!isNaN(+id) && +id < 0) {
			const new_id = generateUUID(move.moveNumber, move.move, move.fen, REPERTOIRE.id);

			id_map[id] = new_id;

			REPERTOIRE.moves![i].id = new_id;
		}

		if (parent_id && !isNaN(+parent_id) && +parent_id < 0) {
			if (id_map[parent_id]) {
				REPERTOIRE.moves![i].parentId = id_map[parent_id];
			}
		}
	}

	const arrows: { [key: string]: Array<any> } = {};

	if (REPERTOIRE.moves) {
		for (const move of REPERTOIRE.moves) {
			if (!arrows[move.id]) {
				arrows[move.id] = [];
			}

			const parent_id = move.parentId || "root";

			if (!arrows[parent_id]) {
				arrows[parent_id] = [];
			}

			arrows[parent_id].push(move.uci);
		}
	}

	const addMove = function(move: any) {
		if (getMoveSimple(REPERTOIRE.moves!, move.id)) {
			return;
		}

		REPERTOIRE.moves!.push(
			{
				id: move.id,
				moveNumber: move.move_num,
				move: move.move,
				fen: move.fen,
				uci: move.uci,
				parentId: move.parent_id,
				sort: next_sort++
			}
		);

		setRepertoire({...REPERTOIRE});
	}

	const setTransposition = function(current_uuid: RepertoireMoveModel["id"], prev_uuid: RepertoireMoveModel["id"]) {
		for (let i = 0; i < REPERTOIRE.moves!.length; i++) {
			const move = REPERTOIRE.moves![i];

			if (move.id === prev_uuid) {
				REPERTOIRE.moves![i].transpositionId = current_uuid;
				
				return setRepertoire({...REPERTOIRE});
			}
		}
	}

	return (
		<ApolloConsumer>
			{client => 
				<ChessController
					key="chess-controller"
					demo={true}
					mode="repertoire"
					repertoire={repertoire}
					client={client}
					onMove={addMove}
					onTransposition={setTransposition}
					arrows={arrows}
				/>
			}
		</ApolloConsumer>
	);
}

export default RepertoireDemo;