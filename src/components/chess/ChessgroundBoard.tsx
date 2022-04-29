import React from "react";
import Chessground from "@goldenchrysus/react-chessground";

import { ChessControllerProps } from "../../lib/types/ChessControllerTypes";
import { RootState } from "../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import { Drawable, DrawShape } from "../../lib/types/models/Chessboard";

interface ChessgroundProps extends PropsFromRedux {
	mode: ChessControllerProps["mode"],
	check: string,
	orientation: string,
	turn_color: string,
	movable: { free: boolean, dests: Map<string, Array<string>> },
	fen?: string,
	last_move: Array<string> | null,
	onMove: Function,
	drawable: Drawable
	onDraw?: (shapes: DrawShape[]) => void
}

class ChessgroundBoard extends React.PureComponent<ChessgroundProps> {
	private board_ref = React.createRef<typeof Chessground>();

	constructor(props: ChessgroundProps) {
		super(props);

		this.sizeBoard = this.sizeBoard.bind(this);
	}

	componentDidMount() {
		this.sizeBoard();
		window.addEventListener("resize", this.sizeBoard);
	}

	render() {
		const drawable = JSON.parse(JSON.stringify(this.props.drawable));

		if (this.props.best_move) {
			drawable.autoShapes.push({
				brush   : "bestMove",
				orig    : this.props.best_move.substring(0, 2),
				mouseSq : this.props.best_move.substring(2, 4),
				dest    : this.props.best_move.substring(2, 4),
			});
		}

		drawable.onChange = this.props.onDraw;

		return (
			<Chessground
				check={this.props.check}
				orientation={this.props.orientation}
				turnColor={this.props.turn_color}
				movable={this.props.movable}
				fen={this.props.fen}
				lastMove={this.props.last_move}
				onMove={this.props.onMove}
				drawable={drawable}
				ref={this.board_ref}
				viewOnly={this.props.mode === "static"}
				coordinates={this.props.mode !== "static"}
			/>
		);
	}

	sizeBoard() {
		if (!this.board_ref.current) {
			return;
		}

		const board = this.board_ref.current.el;

		if (!board) {
			return;
		}

		const parent = board.closest("#chessboard-outer") ?? board.closest(".board-100w") ?? document;

		if (!parent) {
			return;
		}

		const width = (parent.classList?.contains("board-100w"))
			? parent.offsetWidth + "px"
			: Math.min(parent.offsetHeight - 50, parent.offsetWidth) + "px";
		const movelist = board.closest(".chess-outer")?.getElementsByClassName("movelist")[0];

		for (const child of parent.children) {
			child.style.width = width;

			if (child.classList.contains("cg-wrap")) {
				child.style.height = width;
			}
		}

		if (movelist) {
			if (parent.classList?.contains("demo")) {
				return movelist.style.maxHeight = (parent.offsetWidth - 5) + "px";
			}

			let move_height = width;

			const stockfish  = document.getElementById("stockfish")?.offsetHeight ?? 0;
			const controller = document.getElementById("controller")?.offsetHeight ?? 0;
			let adjust_px    = stockfish + controller;

			if (movelist.classList.contains("repertoire")) {
				const collapse: any   = document.getElementById("chess-right-menu")?.getElementsByClassName("ant-collapse")[0];
				const collapse_height = collapse?.offsetHeight ?? 0;

				adjust_px += collapse_height;
			}

			adjust_px  += 7;
			move_height = "calc(" + move_height + " - " + adjust_px + "px)";

			movelist.style.maxHeight = move_height;
		}
	}
}

const mapStateToProps = (state: RootState) => ({
	best_move : state.Chess.best_move
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(ChessgroundBoard);