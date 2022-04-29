import React from "react";
import ChessMaker from "../lib/ChessMaker";

import { ChessControllerProps, ReducerArgument } from "../lib/types/ChessControllerTypes";
import { START_FEN } from "../lib/constants/chess";
import ChessgroundBoard from "./chess/ChessgroundBoard";
import Piece from "./chess/Piece";

import "@goldenchrysus/react-chessground/dist/styles/chessground.css";
import "../styles/components/chessboard.css";
import { Modal } from "antd";
import { Destinations, Drawable, DrawShape } from "../lib/types/models/Chessboard";
import { RepertoireMoveArrowDatumModel, RepertoireQueueItemModel } from "../lib/types/models/Repertoire";
import { ShortMove, Square } from "chess.js";

interface ChessboardProps {
	mode: ChessControllerProps["mode"],
	repertoire_id?: number,
	orientation?: string,
	fen?: string,
	pgn?: string,
	onMove: (action: ReducerArgument) => void,
	auto_shapes?: string[]
	user_shapes?: RepertoireMoveArrowDatumModel["data"]
	queue_item?: RepertoireQueueItemModel | null
	quizzing: boolean
	onDraw?: (shapes: string[]) => void
}

interface Move {
	from: Square,
	to: Square
}

interface ChessboardState {
	pending_move?: Move,
	promoting: boolean
}

class Chessboard extends React.Component<ChessboardProps, ChessboardState> {
	private chess            = ChessMaker.create();
	private last_orientation = "white";
	private fen?: string     = START_FEN;
	private pgn?: string     = "";
	private time             = 0.0;

	constructor(props: ChessboardProps) {
		super(props);

		this.onMove      = this.onMove.bind(this);
		this.onDraw      = this.onDraw.bind(this);
		this.onPromotion = this.onPromotion.bind(this);

		this.last_orientation = props.orientation ?? this.last_orientation;
		this.fen              = props.fen || START_FEN;
		this.pgn              = props.pgn || START_FEN;

		this.state = {
			promoting : false
		};

		this.chess.load(this.fen);
		this.chess.load_pgn(this.pgn);
	}

	shouldComponentUpdate(next_props: ChessboardProps, next_state: ChessboardState): boolean {
		this.last_orientation = next_props.orientation ?? this.last_orientation;

		if (this.props.fen !== next_props.fen || this.props.quizzing || (this.props.queue_item !== next_props.queue_item) || this.props.mode === "review") {
			this.fen = next_props.fen || START_FEN;
			this.pgn = next_props.pgn || START_FEN;

			this.chess.load(this.fen);
			this.chess.load_pgn(this.pgn);
			return true;
		}

		if (next_props.pgn !== this.props.pgn) {
			this.pgn = next_props.pgn || START_FEN;

			this.chess.load_pgn(this.pgn);
			return true;
		}

		return (
			next_props.orientation !== this.props.orientation ||
			next_props.repertoire_id !== this.props.repertoire_id ||
			next_props.queue_item?.id !== this.props.queue_item?.id ||
			next_props.mode !== this.props.mode ||
			next_state.promoting !== this.state.promoting ||
			JSON.stringify(next_props.auto_shapes) !== JSON.stringify(this.props.auto_shapes)
		);
	}

	render(): JSX.Element {
		const drawable: Drawable = {
			eraseOnClick : (this.props.mode === "repertoire") ? false : undefined,
			shapes       : [],
			autoShapes   : [],
			brushes      : {
				green     : { key: "g", color: "#15781B", opacity: 1, lineWidth: 10 },
				red       : { key: "r", color: "#882020", opacity: 1, lineWidth: 10 },
				blue      : { key: "b", color: "#003088", opacity: 1, lineWidth: 10 },
				yellow    : { key: "y", color: "#e68f00", opacity: 1, lineWidth: 10 },
				orange    : { key: "o", color: "#ffa500", opacity: 1, lineWidth: 10 },
				paleBlue  : { key: "pb", color: "#003088", opacity: 0.4, lineWidth: 15 },
				paleGreen : { key: "pg", color: "#15781B", opacity: 0.4, lineWidth: 15 },
				paleRed   : { key: "pr", color: "#882020", opacity: 0.4, lineWidth: 15 },
				paleGrey  : { key: "pgr", color: "#4a4a4a", opacity: 0.35, lineWidth: 15 },
				nextMove  : { key: "m", color: "#800080", opacity: 0.5, lineWidth: 10 },
				bestMove  : { key: "bm", color: "#a52a2a", opacity: 0.7, lineWidth: 10 },
				queueMove : { key: "qm", color: "#ffff00", opacity: 0.7, lineWidth: 10 }
			},
		};

		switch (this.props.mode) {
			case "repertoire":
				for (const uci of this.props.auto_shapes ?? []) {
					drawable.autoShapes.push({
						brush   : "nextMove",
						orig    : uci.slice(0, 2),
						mouseSq : uci.slice(2, 4),
						dest    : uci.slice(2, 4),
					});
				}

				for (const data of this.props.user_shapes ?? []) {
					const parts = data.split(":");

					drawable.shapes.push({
						brush   : parts[2],
						orig    : parts[0],
						mouseSq : parts[1],
						dest    : parts[1]
					});
				}

				break;

			case "lesson":
				if (!this.props.queue_item || this.props.quizzing) {
					break;
				}

				drawable.autoShapes.push({
					brush   : "queueMove",
					orig    : this.props.queue_item.uci.slice(0, 2),
					mouseSq : this.props.queue_item.uci.slice(2, 4),
					dest    : this.props.queue_item.uci.slice(2, 4),
				});
				break;

			case "static":
				drawable.enabled = false;
				drawable.display = false;

				break;
		}

		if (this.props.mode === "review" || this.props.quizzing) {
			this.time = new Date().getTime();
		}

		const turn = this.toColor();

		return (
			<>
				{
					this.props.mode !== "static" && 
					<div className="piece-store w-full" style={{ height: "25px" }}>
						{this.renderCaptures("top")}
					</div>
				}
				<Modal visible={this.state.promoting} footer={null} closable={false} className="promotion-modal">
					<div className="promotion grid grid-cols-4 gap-4">
						<div className={"standalone piece " + turn + " q"} onClick={() => this.onPromotion("q")}></div>
						<div className={"standalone piece " + turn + " r"} onClick={() => this.onPromotion("r")}></div>
						<div className={"standalone piece " + turn + " b"} onClick={() => this.onPromotion("b")}></div>
						<div className={"standalone piece " + turn + " n"} onClick={() => this.onPromotion("n")}></div>
					</div>
				</Modal>
				<ChessgroundBoard
					mode={this.props.mode}
					check={this.checkColor()}
					orientation={this.props.orientation || this.last_orientation}
					turn_color={turn}
					movable={this.toDests()}
					fen={this.props.fen}
					last_move={this.lastMove()}
					onMove={this.onMove}
					drawable={drawable}
					onDraw={this.onDraw}
				/>
				{
					this.props.mode !== "static" && 
					<div className="piece-store w-full" style={{ height: "25px" }}>
						{this.renderCaptures("bottom")}
					</div>
				}
			</>
		);
	}

	lastMove(): string[] | null {
		const history   = this.chess.history({ verbose: true });
		const last_item = (history.length) ? history[history.length - 1] : null;

		return (last_item)
			? [last_item.from, last_item.to]
			: null;
	}

	onMove(orig: Square, dest: Square, capture?: unknown, promo?: ShortMove["promotion"]): void {
		if (!this.props.orientation && !["search", "lesson", "review", "explorer"].includes(this.props.mode)) {
			return;
		}

		if (dest && !promo && ["8", "1"].includes(dest[1])) {
			const candidates = this.chess.moves({ verbose: true });

			for (const candidate of candidates) {
				if (candidate.from === orig && candidate.to === dest && candidate.promotion?.length) {
					return this.setState({
						pending_move : { from: orig, to: dest },
						promoting    : true
					});
				}
			}
		}

		const res = this.chess.move({
			from      : orig,
			to        : dest,
			promotion : promo
		});

		if (!res) {
			this.chess.undo();
			return;
		}

		if (promo) {
			this.setState({
				pending_move : undefined,
				promoting    : false
			});
		}

		const time = (new Date()).getTime() - this.time;

		this.fen = this.chess.fen();
		this.pgn = this.chess.pgn();

		const mode = (this.props.mode === "lesson" && this.props.quizzing) ? "review" : this.props.mode;

		this.props.onMove({
			type  : "move-" + mode,
			uci   : orig + dest,
			time  : time,
			data  : {
				fen   : this.fen,
				pgn   : this.pgn,
				moves : this.chess.history(),
			}
		});	
	}

	onPromotion(piece: ShortMove["promotion"]): void {
		if (!this.state.pending_move) {
			return;
		}

		this.onMove(this.state.pending_move.from, this.state.pending_move.to, undefined, piece);
	}
	
	toColor(): string {
		return (this.chess.turn() === "w") ? "white" : "black";
	}

	checkColor(): string {
		return (this.chess.in_check())
			? this.toColor()
			: "";
	}

	toDests(): Destinations {
		const dests = new Map<string, string[]>();
		
		switch (this.props.mode) {
			case "repertoire":
			case "review":
			case "search":
			case "explorer":
				this.buildRealDests(dests);
				break;

			case "lesson":
				if (this.props.quizzing) {
					this.buildRealDests(dests);
					break;
				}

				if (!this.props.queue_item) {
					break;
				}

				const from = this.props.queue_item?.uci.slice(0, 2);
				const to   = this.props.queue_item?.uci.slice(2, 4);

				dests.set(from, [to]);
				break;
		}

		return {
			free  : false,
			dests : dests
		};
	}

	buildRealDests(dests: Map<string, string[]>): void {
		if (this.props.orientation || ["search", "lesson", "review", "explorer"].includes(this.props.mode)) {
			this.chess.SQUARES.forEach(s => {
				const ms = this.chess.moves({
					square  : s,
					verbose : true
				});

				if (ms.length) {
					dests.set(s, ms.map(m => m.to));
				}
			});
		}
	}

	onDraw(shapes: DrawShape[]): void {
		const data: string[] = [];

		for (const shape of shapes) {
			data.push((shape.orig ?? "") + ":" + (shape.dest ?? "") + ":" + shape.brush);
		}

		this.props.onDraw?.(data);
	}

	renderCaptures(section: string): JSX.Element[] {
		const player = ((this.last_orientation === "white" && section === "bottom") || (this.last_orientation === "black" && section === "top"))
			? "w"
			: "b";
		const moves  = this.chess.history({ verbose: true });
		const count: {[type: string]: number} = {
			p : 0,
			n : 0,
			b : 0,
			r : 0,
			q : 0
		};
		const pieces = [];

		for (const i in moves) {
			const move = moves[i];

			if (move.color !== player) {
				continue;
			}

			if (move.captured) {
				count[move.captured] += 1;
			}
		}

		for (const type in count) {
			if (count[type] === 0) {
				continue;
			}

			const group = [];

			for (let i = 0; i < count[type]; i++) {
				group.push(<Piece key={"captures-" + player + "-" + i} type={type} color={(player === "w") ? "black" : "white"}/>);
			}

			pieces.push(<span className="piece-group" key={"piece-group-" + player + "-" + type}>{group}</span>);
		}

		return pieces;
	}
}

export default Chessboard;