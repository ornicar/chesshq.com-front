import React from "react";
import { Translation } from "react-i18next";
import { TFunction } from "i18next";
import { Collapse } from "antd";

import { ChessControllerProps, ChessControllerState } from "../../lib/types/ChessControllerTypes";
import Tree from "../Tree";
import Repertoires from "./left-menu/Repertoires";

import "../../styles/components/chess/left-menu.css";
import { RepertoireModel } from "../../lib/types/models/Repertoire";
import { CollectionModel } from "../../lib/types/models/Collection";
import PublicRepertoires from "./left-menu/PublicRepertoires";
import GameCollections from "./left-menu/GameCollections";
import MasterGames from "./left-menu/MasterGames";
import GameList from "./left-menu/GameCollections/GameList";
import Results from "./search/Results";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/store";
import Openings from "./left-menu/Openings";
import Transpositions from "./left-menu/Transpositions";

interface LeftMenuProps extends PropsFromRedux {
	repertoire?         : RepertoireModel | null
	collection?         : CollectionModel | null,
	game?               : ChessControllerProps["game"],
	active_uuid         : ChessControllerState["last_uuid"],
	mode                : ChessControllerProps["mode"],
	fen                 : ChessControllerState["fen"],
	movelist            : string,
	onMoveClick?        : Function
	onMoveSearchChange? : Function
}

class LeftMenu extends React.Component<LeftMenuProps> {
	shouldComponentUpdate(prev_props: LeftMenuProps) {
		return (
			prev_props.active_uuid !== this.props.active_uuid ||
			prev_props.mode !== this.props.mode ||
			prev_props.movelist !== this.props.movelist ||
			prev_props.authenticated !== this.props.authenticated ||
			prev_props.game?.id !== this.props.game?.id ||
			prev_props.fen !== this.props.fen ||
			JSON.stringify(prev_props.repertoire) !== JSON.stringify(this.props.repertoire) ||
			JSON.stringify(prev_props.collection) !== JSON.stringify(this.props.collection)
		);
	}

	render() {
		const default_active = [""];
		const route          = window.location.pathname.split("/")[1];
		const is_repertoire  = (["repertoire", "review", "lesson"].includes(this.props.mode) || (this.props.mode === "search" && route === "repertoires"));
		const is_database    = (this.props.mode === "database" || (this.props.mode === "search" && route === "game-database"));
		const is_opening     = (this.props.mode === "opening");
		const is_explorer    = (this.props.mode === "explorer");

		if (is_repertoire) {
			default_active.push("personal-repertoires-panel");
			default_active.push("tree-panel");
		}

		if (is_database) {
			default_active.push("collections-panel");
			default_active.push("game-list-panel");

			if (!this.props.authenticated) {
				default_active.push("master-games-panel");
			}
		}

		if (is_opening) {
			default_active.push("related-master-games-panel");
		}

		if (is_explorer) {
			default_active.push("related-openings-panel");
		}

		return (
			<div key="chess-left-menu-inner" id="chess-left-menu" className="flex-1 w-full min-w-full md:w-auto md:min-w-0 order-3 md:order-1">
				<Translation ns={["repertoires", "database", "openings"]}>
					{
						(t) => (
							<Collapse bordered={false} defaultActiveKey={default_active}>
								{this.renderTree(t)}
								{is_repertoire && this.props.authenticated &&
									<Collapse.Panel id="personal-repertoires-panel" header={t("personal_repertoires")} key="personal-repertoires-panel">
										<Repertoires mode={this.props.mode}/>
									</Collapse.Panel>
								}
								{is_repertoire && !["review", "lesson"].includes(this.props.mode) &&
									<Collapse.Panel id="public-repertoires-panel" header={t("search_public_repertoires")} key="public-repertoires-panel">
										<PublicRepertoires onMoveSearchChange={this.props.onMoveSearchChange} movelist={this.props.movelist} repertoire={this.props.repertoire}/>
									</Collapse.Panel>
								}

								{is_database && this.renderGameList(t)}
								{is_database && this.props.authenticated &&
									<Collapse.Panel id="collections-panel" header={t("database:game_collections")} key="collections-panel">
										<GameCollections/>
									</Collapse.Panel>
								}
								{is_database &&
									<Collapse.Panel id="master-games-panel" header={t("database:search_master_games")} key="master-games-panel">
										<MasterGames onMoveSearchChange={this.props.onMoveSearchChange} movelist={this.props.movelist} game={this.props.game}/>
									</Collapse.Panel>
								}

								{
									is_opening &&
									this.props.game &&
									<Collapse.Panel id="related-master-games-panel" header={t("database:related_master_games")} key="related-master-games-panel">
										<Results
											mode="master_games"
											criteria={{
												mode : "master_games",
												data : {
													eco : String(this.props.game?.id)
												}
											}}
											onResultClick={() => ""}
										/>
									</Collapse.Panel>
								}

								{
									is_explorer &&
									<>
										<Collapse.Panel id="related-transpositions-panel" header={t("openings:potential_transpositions")} key="related-transpositions-panel">
											<Transpositions movelist={this.props.movelist}/>
										</Collapse.Panel>
										<Collapse.Panel id="related-openings-panel" header={t("openings:openings_explorer")} key="related-openings-panel">
											<Openings fen={this.props.fen} movelist={this.props.movelist}/>
										</Collapse.Panel>
									</>
								}
							</Collapse>
						)
					}
				</Translation>
			</div>
		);
	}

	renderTree(t: TFunction) {
		if (this.props.mode !== "repertoire" || !this.props.repertoire) {
			return null;
		}

		return (
			<Collapse.Panel id="tree-panel" header={t("move_tree")} key="tree-panel" forceRender={true}>
				<Tree key="tree" repertoire={this.props.repertoire} active_uuid={this.props.active_uuid} onMoveClick={this.props.onMoveClick}></Tree>
			</Collapse.Panel>
		);
	}

	renderGameList(t: TFunction) {
		if (!this.props.collection) {
			return null;
		}

		return (
			<Collapse.Panel id="game-list-panel" header={t("database:game_list")} key="game-list-panel" forceRender={true}>
				<GameList collection_slug={this.props.collection.slug} games={this.props.collection.games} game={this.props.game}/>
			</Collapse.Panel>
		);
	}
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(LeftMenu);