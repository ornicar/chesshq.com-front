import React from "react";
import Chess, { ChessInstance } from "chess.js";

import { ChessControllerLocalState, ChessControllerProps, ChessControllerState, initial_state, ReducerArgument } from "../lib/types/ChessControllerTypes";
import Chessboard from "../components/Chessboard";
import LeftMenu from "../components/chess/LeftMenu";
import RightMenu from "../components/chess/RightMenu";
import Tree from "../components/Tree";
import { generateUUID, getMove, getMoveSimple } from "../helpers";
import MasterMoveList from "../components/chess/MasterMoveList";
import { RepertoireMoveModel } from "../lib/types/models/Repertoire";
import MoveList from "../components/chess/MoveList";
import { RootState } from "../redux/store";
import { connect, ConnectedProps } from "react-redux";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

class ChessController extends React.Component<ChessControllerProps & PropsFromRedux, ChessControllerState> {
	private chess = Chess2();

	private fen_history: ChessControllerLocalState["fen_history"] = [];

	private original_queue: ChessControllerLocalState["original_queue"] = [];
	private chunk: ChessControllerLocalState["chunk"]                   = [];
	private chunk_limit: ChessControllerLocalState["chunk_limit"]       = 5;

	private reviews: ChessControllerLocalState["reviews"] = {};

	private needs_reset: ChessControllerLocalState["needs_reset"]         = false;
	private progressing: ChessControllerLocalState["progressing"]         = false;
	private preloaded_moves: ChessControllerLocalState["preloaded_moves"] = [""];

	private last_search_state: ChessControllerState | undefined = undefined;

	private ref: any | undefined = undefined;

	constructor(props: ChessControllerProps & PropsFromRedux) {
		super(props);

		if (["database", "opening"].includes(this.props.mode) && this.props.game) {
			this.state = this.buildGameState();
		} else {
			this.state = initial_state;
		}

		this.reducer     = this.reducer.bind(this);
		this.onMoveClick = this.onMoveClick.bind(this);
		this.onDraw      = this.onDraw.bind(this);
		this.ref         = React.createRef<HTMLDivElement>();
	}

	reset(state?: ChessControllerState) {
		this.chunk_limit     = 5;
		this.progressing     = false;
		this.preloaded_moves = [""];
		this.fen_history     = [];

		this.chess.reset();
		this.setOriginalQueue();
		this.setState(state ?? initial_state);
		this.progressQueue();
	}

	buildGameState() {
		this.chess.reset();
		this.chess.load_pgn(this.props.game?.pgn || initial_state.pgn);

		const new_state = {...initial_state};

		new_state.moves   = this.chess.history();
		new_state.history = [];

		for (const i in new_state.moves) {
			new_state.history.push({
				id   : i,
				move : new_state.moves[i]
			});
		}

		new_state.moves = [];

		return new_state;
	}

	componentDidUpdate(prev_props: ChessControllerProps, prev_state: ChessControllerState) {
		if (["database", "opening"].includes(this.props.mode) && (prev_props.game?.id !== this.props.game?.id || prev_props.mode !== this.props.mode)) {
			return this.reset(this.buildGameState());
		}

		if (prev_props.repertoire?.id !== this.props.repertoire?.id || prev_props.mode !== this.props.mode) {
			let new_state = undefined;

			if (this.props.mode === "search" && prev_props.mode !== "search") {
				new_state = this.last_search_state;
			}

			return this.reset(new_state);
		}

		if (this.props.mode === "search") {
			this.last_search_state = {...this.state};
		}

		if (["review", "lesson"].includes(this.props.mode)) {
			if (this.needs_reset) {
				this.needs_reset = false;

				this.chess.reset();

				this.preloaded_moves = [""];
				this.fen_history         = [];

				setTimeout(
					() => {
						this.setState({
							fen        : initial_state.fen,
							pgn        : initial_state.pgn,
							history    : initial_state.history,
							moves      : initial_state.moves,
							last_num   : initial_state.last_num,
							preloading : true,
							quizzing   : true
						});
					},
					500
				);
				return;
			}

			const queue = (this.props.mode === "review") ? this.props.repertoire?.reviewQueue : this.props.repertoire?.lessonQueue;

			if (this.original_queue === undefined || (queue && this.original_queue.length < queue.length)) {
				this.setOriginalQueue();
				this.progressQueue();
				return;
			}

			if (
				this.state.preloading !== prev_state.preloading ||
				this.state.fen !== prev_state.fen ||
				this.state.queue_index !== prev_state.queue_index ||
				this.state.quizzing !== prev_state.quizzing ||
				this.state.quizzing
			) {
				if (!this.progressing && !this.state.awaiting_user) {
					return this.progressQueue();
				}
			}
		}

		// Moves were deleted
		if (this.props.mode === "repertoire" && (prev_props.repertoire?.moves?.length ?? 0) > (this.props.repertoire?.moves?.length ?? 0)) {
			if (!this.props.repertoire || !this.props.repertoire.moves) {
				return;
			}

			const valid_moves = [];

			for (const move of this.props.repertoire.moves) {
				valid_moves.push(move.id);
			}

			for (const move of this.state.history) {
				if (!valid_moves.includes(String(move.id))) {
					return this.reset();
				}
			}
		}
	}

	render() {
		const auto_shapes   = (this.state.last_uuid) ? this.props.arrows?.[this.state.last_uuid] || [] : this.props.arrows?.["root"] || [];
		const user_shapes   = (this.state.last_uuid) ? getMove(this.props.client, this.state.last_uuid)?.arrow?.data ?? [] : [];
		const queue_item    = (this.props.mode === "lesson" && this.original_queue) ? this.original_queue[this.state.queue_index] : null;
		const board_classes = [""];
		const outer_classes = ["chess-outer flex gap-x-8 md:gap-x-4 lg:gap-x-8"];

		if (this.props.demo) {
			board_classes.push("board-100w flex-1 demo w-full max-w-full lg:max-w-2/3 lg:w-2/3");
			outer_classes.push("flex-wrap lg:flex-nowrap");
		} else {
			board_classes.push("flow-grow-0 order-1 w-full md:order-2 md:w-chess md:max-w-chess min-w-chess-small md:min-w-chess-tablet lg:min-w-chess");
			outer_classes.push("flex-wrap min-h-full");
		}

		return (
			<>
				<div key="chess-outer" ref={this.ref} className={outer_classes.join(" ")}>
					{
						this.props.demo &&
						this.props.mode === "repertoire" &&
						<div id="tree-panel" className="flex-initial w-full lg:w-1/3">
							<Tree
								repertoire={this.props.repertoire}
								active_uuid={this.state.last_uuid}
								onMoveClick={this.onMoveClick.bind(this, "tree")}
							/>
						</div>
					}

					<div key="chessboard-outer" id="chessboard-outer" className={board_classes.join(" ")}>
						<Chessboard
							mode={this.props.mode}
							key="chessboard"
							fen={this.state.fen}
							pgn={this.state.pgn}
							orientation={(this.props.demo || (this.props.authenticated && this.props.repertoire?.userOwned)) ? this.props.repertoire?.side : undefined}
							repertoire_id={this.props.repertoire?.id}
							onMove={this.reducer}
							auto_shapes={auto_shapes}
							user_shapes={user_shapes}
							queue_item={(this.state.awaiting_user) ? queue_item : null}
							quizzing={this.state.quizzing}
							onDraw={this.onDraw}
						/>
						{this.renderMasterMoveList()}
					</div>

					{!this.props.demo && <LeftMenu
						key="chess-left-menu-component"
						active_uuid={this.state.last_uuid}
						movelist={this.state.moves.join(".")}
						fen={this.state.fen}
						mode={this.props.mode}
						repertoire={this.props.repertoire}
						collection={this.props.collection}
						game={this.props.game}
						onMoveClick={this.onMoveClick.bind(this, "tree")}
						onMoveSearchChange={this.props.onMoveSearchChange}
					/>}
					{!this.props.demo && <RightMenu
						key="chess-right-menu-component"
						active_num={this.state.last_num}
						active_uuid={this.state.last_uuid}
						moves={this.state.history}
						fen={this.state.fen}
						mode={this.props.mode}
						fen_history={this.fen_history}
						repertoire={this.props.repertoire}
						collection={this.props.collection}
						game={this.props.game}
						onMoveClick={this.onMoveClick.bind(this, "history")}
					/>}

					{
						this.props.demo &&
						(["database", "openings"].includes(this.props.mode)) &&
						<div className="flex-initial w-full lg:w-1/3">
							<MoveList
								demo={true}
								mode={this.props.mode}
								active_num={this.state.last_num}
								fen={this.state.fen}
								moves={this.state.history}
								onMoveClick={this.onMoveClick.bind(this, "history")}
							/>
						</div>
					}
				</div>
			</>
		);
	}

	renderMasterMoveList() {
		return (this.props.demo || ["review", "lesson"].includes(this.props.mode))
			? <></>
			: <MasterMoveList fen={this.state.fen} onMoveClick={this.onMoveClick.bind(this, "master-movelist")}/>;
	}

	setOriginalQueue() {
		if (this.props.mode === "review") {
			this.original_queue = this.props.repertoire?.reviewQueue ?? [];
			this.chunk          = this.props.repertoire?.reviewQueue ?? [];
		} else if (this.props.mode === "lesson") {
			this.original_queue = this.props.repertoire?.lessonQueue ?? [];
			this.chunk          = [];
		}
	}

	progressQueue() {
		if (this.progressing || !["review", "lesson"].includes(this.props.mode)) {
			return;
		}

		this.progressing = true;

		const move = (this.state.quizzing || this.props.mode === "review")
			? ((this.chunk && this.chunk.length) ? this.chunk[0] : null)
			: ((this.original_queue) ? this.original_queue[this.state.queue_index] : null);

		if (!move) {
			this.progressing = false;

			return;
		}

		let pre_moves      = JSON.parse(move.movelist).slice(0, -1);
		let pre_move_index = -1;

		if (pre_moves.join(":") === this.preloaded_moves.join(":")) {
			pre_moves = [];
		} else if (pre_moves.slice(0, -1).join(":") === this.preloaded_moves.join(":")) {
			pre_moves = pre_moves.slice(-1);
		} else {
			this.preloaded_moves = [];
			this.fen_history         = [];

			this.chess.reset();
		}

		if (pre_moves.length) {
			const pre_move_interval = setInterval(
				() => {
					pre_move_index++;

					if (pre_move_index >= pre_moves.length) {
						clearInterval(pre_move_interval);
						return;
					}

					const move = pre_moves[pre_move_index];

					this.preloaded_moves.push(move);
					this.chess.move(move);

					const history = this.chess.history();

					this.progressing = (pre_move_index !== (pre_moves.length - 1));

					this.reducer({
						type  : "queue-premove",
						data  : {
							preloading : this.progressing,
							pgn        : this.chess.pgn(),
							fen        : this.chess.fen(),
							moves      : history
						}
					});
				},
				500
			);
		} else {
			this.progressing = false;

			this.setState({
				preloading    : false,
				awaiting_user : true
			});
		}
	}

	generateHistory(uuid?: string | null) {
		const data: { [ key: string] : any } = {
			moves   : [],
			history : [],
		};

		if (!uuid) {
			return data;
		}

		do {
			const move: RepertoireMoveModel = (this.props.demo) ? getMoveSimple(this.props.repertoire?.moves ?? [], uuid) : getMove(this.props.client, uuid);

			if (!move) {
				// TODO: Throw error, undo action
			}

			data.history.push({
				id   : uuid,
				move : move.move
			});

			data.moves.push(move.move);

			uuid = move.parentId;
		} while (uuid);

		data.moves   = data.moves.reverse();
		data.history = data.history.reverse();

		return data;
	}

	onMoveClick(source: string, uuid?: string, san?: string) {
		switch (this.props.mode) {
			case "repertoire":
				if (source === "master-movelist") {
					if (!san) {
						return;
					}

					const res = this.chess.move(san);

					if (!res) {
						this.chess.undo();
						return false;
					}

					const history = this.chess.history({verbose: true});
					const last    = history[history.length - 1];

					return this.reducer({
						type  : "move-repertoire",
						uci   : last!.from + last!.to,
						moved : true,
						data  : {
							fen   : this.chess.fen(),
							pgn   : this.chess.pgn(),
							moves : this.chess.history()
						}
					});
				}

				this.fen_history = [];

				this.chess.reset();

				const data = this.generateHistory(uuid);

				for (const item of data.history) {
					this.chess.move(item.move);

					this.fen_history.push({
						move_id : item.uuid,
						fen     : this.chess.fen()
					});
				}

				return this.reducer({
					type  : "click-" + source,
					data  : {
						pgn       : this.chess.pgn(),
						last_uuid : uuid,
						fen       : this.chess.fen(),
						moves     : data.moves,
						history   : (source === "tree") ? data.history : this.state.history,
					}
				});

			case "search":
				if (source === "master-movelist") {
					if (!san) {
						return;
					}

					const res = this.chess.move(san);

					if (!res) {
						this.chess.undo();
						return false;
					}

					return this.reducer({
						type  : "move-search",
						data  : {
							fen   : this.chess.fen(),
							pgn   : this.chess.pgn(),
							moves : this.chess.history()
						}
					});
				}

				if (!uuid) {
					uuid = "-1";
				}

				this.chess.reset();

				this.fen_history = [];

				for (const i in this.state.history) {
					if (+i > +uuid) {
						break;
					}

					this.chess.move(this.state.history[i].move);

					this.fen_history.push({
						move_id : "",
						fen     : this.chess.fen()
					})
				}

				return this.reducer({
					type  : "click-search",
					data  : {
						fen     : this.chess.fen(),
						pgn     : this.chess.pgn(),
						moves   : this.chess.history(),
						history : this.state.history
					}
				});

			case "database":
			case "opening":
			case "explorer":
				if (source === "master-movelist") {
					if (this.props.mode !== "explorer") {
						return;
					} else {
						if (!san) {
							return;
						}
	
						const res = this.chess.move(san);
	
						if (!res) {
							this.chess.undo();
							return false;
						}
	
						return this.reducer({
							type  : "move-explorer",
							data  : {
								fen   : this.chess.fen(),
								pgn   : this.chess.pgn(),
								moves : this.chess.history()
							}
						});
					}
				}

				if (!uuid) {
					uuid = "-1";
				}

				this.chess.reset();

				this.fen_history = [];

				for (const i in this.state.history) {
					if (+i > +uuid) {
						break;
					}

					this.chess.move(this.state.history[i].move);

					this.fen_history.push({
						move_id : "",
						fen     : this.chess.fen()
					})
				}

				return this.reducer({
					type  : "click-game",
					data  : {
						fen     : this.chess.fen(),
						pgn     : this.chess.pgn(),
						moves   : this.chess.history(),
						history : this.state.history
					}
				});

			default:
				break;
		}
	}

	buildQueueHistory(new_state: any) {
		const real_history = [];
		let history_id     = 0;

		for (const move of new_state.moves) {
			real_history.push({
				id   : --history_id,
				move : move
			});
		}

		return real_history;
	}

	shakeBoard() {
		const board = this.ref.current?.getElementsByClassName("cg-wrap")[0];

		if (!board) {
			return;
		}

		board.classList.remove("shake");

		// eslint-disable-next-line
		const height = board.offsetHeight; // Force DOM update

		board.classList.add("shake");
	}

	reducer(action: ReducerArgument): void {
		const new_state: ChessControllerState = {
			fen           : action.data.fen,
			pgn           : action.data.pgn,
			last_num      : this.state.last_num,
			last_uuid     : action.data.last_uuid ?? this.state.last_uuid,
			moves         : action.data.moves,
			history       : action.data.history ?? this.state.history,
			queue_index   : this.state.queue_index,
			preloading    : action.data.preloading ?? this.state.preloading,
			quizzing      : this.state.quizzing,
			awaiting_user : this.state.awaiting_user
		};
		const move_num  = Math.floor(((new_state.moves.length + 1) / 2) * 10);
		const last_move = (new_state.moves.length) ? new_state.moves[new_state.moves.length - 1] ?? "" : "";

		new_state.last_num = move_num;

		switch (action.type) {
			case "click-history":
			case "click-tree":
			case "click-game":
				this.setState(new_state);
				break;

			case "move-search":
			case "click-search":
			case "move-explorer":
				if (action.type === "move-search" || action.type === "move-explorer") {
					this.chess.move(last_move);

					this.fen_history.push({
						move_id : "",
						fen     : new_state.fen
					});

					new_state.history = [];

					for (const i in new_state.moves) {
						new_state.history.push({
							id   : i,
							move : new_state.moves[i]
						})
					}
				}

				this.setState(new_state);
				break;

			case "queue-premove":
				new_state.history = this.buildQueueHistory(new_state);

				this.setState(new_state);
				break;

			case "move-lesson":
				this.chunk.push(this.original_queue[this.state.queue_index]);
				this.chess.move(last_move);
				this.preloaded_moves.push(last_move);

				this.progressing = false;

				if (this.chunk.length === this.chunk_limit || this.state.queue_index >= (this.original_queue.length - 1)) {
					this.needs_reset = true;

					this.setState({
						awaiting_user : false,
						fen           : new_state.fen,
						pgn           : new_state.pgn,
						history       : this.buildQueueHistory(new_state),
						moves         : new_state.moves,
						last_num      : move_num,
						preloading    : false
					});
				} else {
					this.setState({
						awaiting_user : false,
						queue_index   : this.state.queue_index + 1,
						fen           : new_state.fen,
						pgn           : new_state.pgn,
						history       : this.buildQueueHistory(new_state),
						moves         : new_state.moves,
						last_num      : move_num
					});
				}
				break;

			case "move-review":
				const review_move = this.chunk[0];

				if (!review_move) {
					return this.setState(this.state);
				}

				const correct = (review_move.move === last_move);

				if (!this.reviews[review_move.id]) {
					this.reviews[review_move.id] = {
						moveId             : review_move.id,
						incorrectAttempts  : 0,
						attempts           : 0,
						averageCorrectTime : 0.0,
						averageTime        : 0.0
					};
				}

				this.reviews[review_move.id].attempts += 1;

				if (!correct) {
					let pseudo_correct = false;

					if (this.props.mode === "review" && review_move.similarMoves) {
						pseudo_correct = review_move.similarMoves.split(",").includes(last_move);
					}

					this.shakeBoard();

					if (!pseudo_correct) {
						this.reviews[review_move.id].incorrectAttempts += 1;

						this.reviews[review_move.id].averageTime = (
							(
								(this.reviews[review_move.id].averageTime * (this.reviews[review_move.id].attempts - 1)) +
								(action.time ?? 0)
							) /
							this.reviews[review_move.id].attempts
						);
					} else {
						this.reviews[review_move.id].attempts -= 1;
					}

					this.setState(this.state);
					break;
				}

				const correct_attempts = this.reviews[review_move.id].attempts - this.reviews[review_move.id].incorrectAttempts;

				this.reviews[review_move.id].averageCorrectTime = (
					(
						(this.reviews[review_move.id].averageCorrectTime * (correct_attempts- 1)) +
						(action.time ?? 0)
					) /
					correct_attempts
				);

				this.chunk = this.chunk.slice(1);

				const quizzing = (this.chunk.length > 0 && this.props.mode === "lesson");

				this.chess.move(last_move);

				if (last_move) {
					this.preloaded_moves.push(last_move);
				}

				this.setState({
					awaiting_user : false,
					preloading    : false,
					fen           : new_state.fen,
					pgn           : new_state.pgn,
					history       : this.buildQueueHistory(new_state),
					moves         : new_state.moves,
					last_num      : move_num,
					quizzing      : quizzing,
					queue_index   : (quizzing) ? this.state.queue_index : this.state.queue_index + 1
				});
				this.props.onReview?.(this.reviews[review_move.id]);
				break;

			case "move-repertoire":
				if (!this.props.repertoire) {
					return this.setState(this.state);
				}

				const prev_uuid = this.state.last_uuid;
				const uuid      = generateUUID(move_num, last_move!, new_state.fen, this.props.repertoire.id);

				this.fen_history.push({
					move_id : uuid,
					fen     : new_state.fen
				});
				
				if (!action.moved) {
					this.chess.move(last_move);
				}

				new_state.last_uuid = uuid;

				if (!this.historyContainsUUID(uuid)) {
					if (!new_state.history) {
						new_state.history = [...this.state.history];
					}

					new_state.history.push({
						id   : uuid,
						move : last_move
					});
				}

				const cached_move = (!this.props.demo) ? getMove(this.props.client, uuid) : getMoveSimple(this.props.repertoire.moves ?? [], uuid);

				if (!cached_move) {
					if (!this.props.repertoire.userOwned) {
						return this.setState(this.state);
					}

					this.setState(new_state);
					this.props.onMove?.(
						{
							id        : uuid,
							parent_id : prev_uuid,
							move_num  : move_num,
							move      : last_move,
							uci       : action.uci,
							fen       : new_state.fen
						}
					);
				} else if (prev_uuid && cached_move.parentId !== prev_uuid) {
					const prev_move = (!this.props.demo) ? getMove(this.props.client, prev_uuid) : getMoveSimple(this.props.repertoire.moves ?? [], prev_uuid);

					if (prev_move && prev_move.transpositionId !== uuid) {
						this.props.onTransposition?.(uuid, prev_uuid);
					}

					this.setState(new_state);
				} else {
					this.setState(new_state);
				}
	
				break;
	
			default:
				break;
		}
	}

	historyContainsUUID(uuid: string) {
		return (this.state.history.filter(x => x.id === uuid).length > 0);
	}

	onDraw(data: string[]): void {
		if (this.props.mode !== "repertoire" || !this.state.last_uuid) {
			return;
		}

		this.props.onDraw?.(this.state.last_uuid, data);
	}
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(ChessController);