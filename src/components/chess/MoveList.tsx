import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faAngleLeft, faAngleDoubleRight, faAngleRight, faChess, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import { ChessControllerHistoryItem, ChessControllerProps, ChessControllerState } from "../../lib/types/ChessControllerTypes";

import "../../styles/components/chess/move-list.css";

import Move from "./move-list/Move";
import Stockfish from "./move-list/Stockfish";
import { getDBMoveNumFromIndex, getIndexFromDBMoveNum } from "../../helpers";
import { Tabs } from "antd";
import PGNData from "./right-menu/PGNData";
import { Translation } from "react-i18next";

interface MoveListProps {
	mode: ChessControllerProps["mode"],
	game?: ChessControllerProps["game"],
	demo?: boolean,
	active_num?: ChessControllerState["last_num"],
	fen: string,
	moves: ChessControllerState["history"],
	onMoveClick: Function
}

class MoveList extends React.Component<MoveListProps> {
	shouldComponentUpdate(next_props: MoveListProps) {
		return (
			next_props.fen !== this.props.fen ||
			next_props.active_num !== this.props.active_num ||
			next_props.mode !== this.props.mode ||
			JSON.stringify(next_props.moves) !== JSON.stringify(this.props.moves)
		);
	}

	componentDidMount = () => {
		window.dispatchEvent(new Event("resize"));
	}

	render() {
		const solo_class = (!this.props.game || this.props.mode !== "database") ? "solo" : "";

		return (
			<Translation ns={["chess", "database"]}>
				{
					(t) => (
						<>
							{!this.props.demo && <Stockfish mode={this.props.mode} fen={this.props.fen} num={this.props.active_num} key="stockfish-component"/>}
							<Tabs type="card" tabBarGutter={0} tabBarStyle={{ margin: 0 }} centered={true} id="movelist-tabs" className={solo_class}>
								<Tabs.TabPane tab={<><FontAwesomeIcon icon={faChess} className="mr-2"/>{t("move_other")}</>} key="movelist">
									<div key="movelist" id="movelist" className={"movelist scroll-shadow max-w-full " + this.props.mode}>
										{this.props.moves?.map((move, i, moves) => this.renderListMove(move, i, moves))}
									</div>
									<div key="movelist-controller" id="movelist-controller" className="max-w-full">
										<div className="max-w-full">
											{this.renderControls()}
										</div>
									</div>
								</Tabs.TabPane>
								<Tabs.TabPane tab={<><FontAwesomeIcon icon={faInfoCircle} className="mr-2"/>{t("database:pgn_data")}</>} key="pgn">
									{
										this.props.game?.id && this.props.mode === "database" &&
										<PGNData game={this.props.game}/>
									}
								</Tabs.TabPane>
							</Tabs>
						</>
					)
				}
			</Translation>
		);
	}

	renderListMove(item: ChessControllerHistoryItem, index: number, moves: MoveListProps["moves"]) {
		if (index % 2 === 1) {
			return;
		}

		const move_num   = getDBMoveNumFromIndex(index);
		let active_color = null;

		if (this.props.active_num === move_num) {
			active_color = "white";
		} else if (this.props.active_num === (move_num + 5)) {
			active_color = "black";
		}

		return <Move key={"movelist-move-" + index} index={index} white={item} black={moves[index + 1]} active_color={active_color} onClick={this.props.onMoveClick}/>;
	}

	renderControls() {
		const active_index = (this.props.active_num) ? getIndexFromDBMoveNum(this.props.active_num) : 0;
		const prev_active  = (active_index >= 0);
		const next_active  = (active_index < (this.props.moves.length - 1));

		return(
			<div className="grid grid-cols-12">
				<div className="col-span-2"></div>
				<button className="py-1 col-span-2" disabled={!prev_active} onClick={() => this.onButtonClick("begin")}>
					<FontAwesomeIcon style={{fontSize: "1.5em"}} icon={faAngleDoubleLeft}/>
				</button>
				<button className="py-1 col-span-2" disabled={!prev_active} onClick={() => this.onButtonClick("prev")}>
					<FontAwesomeIcon style={{fontSize: "1.5em"}} icon={faAngleLeft}/>
				</button>
				<button className="py-1 col-span-2" disabled={!next_active} onClick={() => this.onButtonClick("next")}>
					<FontAwesomeIcon style={{fontSize: "1.5em"}} icon={faAngleRight}/>
				</button>
				<button className="py-1 col-span-2" disabled={!next_active} onClick={() => this.onButtonClick("end")}>
					<FontAwesomeIcon style={{fontSize: "1.5em"}} icon={faAngleDoubleRight}/>
				</button>
				<div className="col-span-2"></div>
			</div>
		);
	}

	onButtonClick(type: string) {
		const active_index = (this.props.active_num) ? getIndexFromDBMoveNum(this.props.active_num) : 0;
		const last_index   = Math.max(this.props.moves.length - 1, 0);

		switch (type) {
			case "begin":
				this.props.onMoveClick("");
				break;

			case "prev":
				const prev = Math.max(active_index - 1, -1);
				const id   = (prev >= 0) ? this.props.moves[prev].id : "";

				this.props.onMoveClick(id);
				break;

			case "next":
				const next = Math.min(active_index + 1, last_index);

				this.props.onMoveClick(this.props.moves[next].id);
				break;

			case "end":
				this.props.onMoveClick(this.props.moves[last_index].id);
				break;

			default:
				break;
		}
	}
}

export default MoveList;