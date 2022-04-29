import React from "react";
import { Translation } from "react-i18next";
import { Collapse, Input } from "antd";
import { ChessControllerLocalState, ChessControllerProps, ChessControllerState } from "../../lib/types/ChessControllerTypes";

import MoveList from "./MoveList";
import Repertoire from "./right-menu/Repertoire";

import "../../styles/components/chess/right-menu.css";
import RepertoireMoveNote from "./right-menu/RepertoireMoveNote";
import ECO from "./right-menu/ECO";
import GameCollection from "./right-menu/GameCollection";
import Opening from "./right-menu/Opening";
import Game from "./right-menu/Game";

interface RightMenuProps {
	active_num?: ChessControllerState["last_num"],
	active_uuid?: ChessControllerState["last_uuid"],
	fen: string,
	moves: ChessControllerState["history"],
	mode: ChessControllerProps["mode"],
	fen_history: ChessControllerLocalState["fen_history"],
	repertoire?: ChessControllerProps["repertoire"],
	collection?: ChessControllerProps["collection"],
	game?: ChessControllerProps["game"],
	onMoveClick: Function
}

class RightMenu extends React.Component<RightMenuProps> {
	shouldComponentUpdate(prev_props: RightMenuProps) {
		return (
			prev_props.active_num !== this.props.active_num ||
			prev_props.fen !== this.props.fen ||
			prev_props.moves !== this.props.moves ||
			prev_props.mode !== this.props.mode ||
			prev_props.repertoire?.id !== this.props.repertoire?.id ||
			prev_props.collection?.id !== this.props.collection?.id ||
			prev_props.game?.id !== this.props.game?.id
		);
	}

	render() {
		return (
			<div key="chess-right-menu-inner" id="chess-right-menu" className="flex-1 order-2 mb-6 md:order-3 md:mb-0">
				{
					this.props.repertoire?.id && ["repertoire", "lesson", "review"].includes(this.props.mode) &&
					<Repertoire mode={this.props.mode} repertoire={this.props.repertoire}/>
				}
				{
					this.props.collection?.id && this.props.mode === "database" &&
					<GameCollection collection={this.props.collection}/>
				}
				{
					this.props.game?.id &&
					this.props.mode === "database" &&
					<Game game={this.props.game}/>
				}
				{
					this.props.game?.id && this.props.mode === "opening" &&
					<Opening opening={this.props.game}/>
				}
				<MoveList mode={this.props.mode} game={this.props.game} active_num={this.props.active_num} fen={this.props.fen} moves={this.props.moves} onMoveClick={this.props.onMoveClick}/>
				<Translation ns="chess">
					{
						(t) => (
							<Collapse accordion bordered={false} defaultActiveKey="position-panel" className="top-border">
								<Collapse.Panel id="position-panel" header={t("position_data")} key="position-panel">
									<Input addonBefore="FEN" value={this.props.fen}/>
									{this.props.repertoire?.id && <ECO history={this.props.fen_history}/>}
									{!["review", "lesson"].includes(this.props.mode) && this.props.repertoire?.userOwned && <RepertoireMoveNote active_uuid={this.props.active_uuid}/>}
								</Collapse.Panel>
							</Collapse>
						)
					}
				</Translation>
			</div>
		);
	}
}

export default RightMenu;