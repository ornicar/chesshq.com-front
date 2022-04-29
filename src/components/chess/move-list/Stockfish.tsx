import React from "react";
import { Translation } from "react-i18next";
import { Switch } from "antd";

import "../../../styles/components/chess/move-list/stockfish.css";
import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import { setBestMove } from "../../../redux/slices/chess";
import { connect, ConnectedProps } from "react-redux";

declare global {
	interface Window {
		sf : any
	}
}

interface StockfishProps extends PropsFromRedux {
	mode: ChessControllerProps["mode"],
	fen: string,
	num?: number
}

interface StockfishState {
	available: boolean,
	score: string,
	depth: number,
	enabled: boolean
}

class Stockfish extends React.Component<StockfishProps, StockfishState> {
	set_listener = false;
	engine       = null;
	waiting      = false;

	interval: NodeJS.Timer | undefined = undefined;

	constructor(props: StockfishProps) {
		super(props);

		this.receiveEval = this.receiveEval.bind(this);
		this.toggle      = this.toggle.bind(this);
		this.state       = {
			available : false,
			score     : "-",
			depth     : 0,
			enabled   : localStorage.getItem("stockfish") === "1"
		};

		this.setListener();
	}
	
	componentDidMount = () => {
		if (!window.sf) {
			this.interval = setInterval(
				() => {
					if (window.sf) {
						this.setListener();
						window.sf.postMessage("isready");
					}
				},
				1000
			);
		} else {
			this.setListener();
			window.sf.postMessage("isready");
		}
	}

	componentDidUpdate(prev_props: StockfishProps, prev_state: StockfishState) {
		if (prev_props.fen !== this.props.fen || prev_state.available !== this.state.available) {
			this.runEval(true);
		}

		if (prev_props.mode !== this.props.mode) {
			if (["review", "lesson"].includes(this.props.mode)) {
				this.toggle(false);
			}
		}
	}

	componentWillUnmount() {
		this.props.setBestMove("");

		if (window.sf && this.set_listener) {
			window.sf.removeMessageListener(this.receiveEval);
		}
	}

	render() {
		return (
			<div key="stockfish" id="stockfish" className="max-w-full">
				<div className="max-w-full 2xl:max-w-sm">
					<div key="stockfish-grid" className="grid grid-cols-12 p-2">
						<Translation ns="chess">
							{
								(t) => (
									<>
										<div key="stockfish-eval" className="flex justify-center items-center text-center text-2xl font-bold col-span-3">
											<span>{(this.state.enabled) ? this.state.score || "-" : "-"}</span>
										</div>
										<div key="stockfish-feedback" className="text-left text-xs text-gray-400 col-span-6">
											<p>Stockfish 14+ <span className="text-green-500 font-medium">NNUE</span></p>
											<p>{(this.state.depth && this.state.enabled) ? t("depth") + ": " + this.state.depth + "/20" : t("waiting")}</p>
										</div>
										<div key="stockfish-switch-container" className="flex justify-end items-center col-span-3">
											<Switch checked={this.state.enabled} disabled={!this.state.available || ["review", "lesson"].includes(this.props.mode)} onChange={this.toggle}/>
										</div>
									</>
								)
							}
						</Translation>
					</div>
				</div>
			</div>
		);
	}

	toggle(enabled: boolean) {
		localStorage.setItem("stockfish", (enabled) ? "1" : "0");
		this.setState({
			enabled: enabled
		});

		if (enabled) {
			this.runEval(true, true);
		} else {
			this.props.setBestMove("");
		}
	}

	receiveEval(line: string): void {
		if (line === "readyok" && this.waiting) {
			return this.runEval(false, true);
		} else if (line === "readyok" && !this.state.available) {
			if (this.interval) {
				clearInterval(this.interval);
			}

			return this.setState({
				available : true
			});
		}

		if (line.slice(0, 8) === "bestmove") {
			const move = line.split(" ")[1];

			this.props.setBestMove(move);
			return;
		}

		const score_index = line.indexOf("score");

		if (!score_index) {
			return;
		}

		const depth      = +line.split(" ")[2];
		const node_index = line.indexOf("nodes", score_index);
		const score_text = line.slice(score_index + 6, (node_index !== -1) ? node_index - 1 : 100);
		const score_data = score_text.split(" ");
		const multiplier = ((this.props.num ?? 0) % 10 !== 0) ? 1 : -1;
		const best_move  = line?.match(/pv [a-z\d]{4}/)?.[0].replace("pv ", "");

		switch (score_data[0]) {
			case "cp":
				const score  = (+score_data[1] / 100) * multiplier;
				const prefix = (score > 0) ? "+" : "";

				this.setState({
					score : prefix + (score.toFixed(2)),
					depth : depth
				});
				break;

			case "mate":
				this.setState({
					score : "M" + (+score_data[1] * multiplier),
					depth : (+score_data[1] === 0) ? 20 : depth
				});
				break;

			default:
				break;
		}

		if (best_move && depth >= 10) {
			this.props.setBestMove(best_move);
		}
	}

	setListener() {
		if (!window.sf || this.set_listener) {
			return;
		}

		this.set_listener = true;

		window.sf.addMessageListener(this.receiveEval);
	}

	runEval(waiting: boolean, force?: boolean) {
		this.props.setBestMove("");
		this.setListener();

		if (!this.state.enabled && !force) {
			return;
		}

		if (!this.props.fen || !this.props.num) {
			return;
		}

		const sf = window.sf;
		
		if (sf) {
			if (waiting) {
				this.waiting = true;

				sf.postMessage("stop");
				sf.postMessage("isready");
			} else {
				this.waiting = false;

				sf.postMessage("ucinewgame");
				sf.postMessage("position fen " + this.props.fen);
				sf.postMessage("go depth 20");
			}
		}
	}
}

const mapDispatchToProps = {
	setBestMove : (move: string) => setBestMove(move)
};
const connector      = connect(undefined, mapDispatchToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(Stockfish);