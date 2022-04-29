import React from "react";
import { Button, Collapse } from "antd";
import { useTranslation } from "react-i18next";

import { RootState } from "../../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import { GameModel } from "../../../lib/types/models/Game";
import { EcoPositionModel } from "../../../lib/types/models/EcoPosition";
import { Link } from "react-router-dom";
import SaveGame from "./SaveGame";

interface GameProps extends PropsFromRedux {
	game?: GameModel | EcoPositionModel
}

function downloadPGN(pgn: string) {
	if (!pgn) {
		return;
	}

	const blob = new Blob([pgn], {
		type : "text/plain"
	});
	const url = window.URL.createObjectURL(blob);
	const a   = document.createElement("a");

	a.href     = url;
	a.download = "game.pgn";

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	window.URL.revokeObjectURL(url);
}

function Game(props: GameProps) {
	const { t } = useTranslation(["database", "chess"]);

	return (
		<Collapse bordered={false} activeKey="game-panel">
			<Collapse.Panel showArrow={false} id="game-panel" header={t("chess:game_one") + ": " + props.game?.white + " - " + props.game?.black} key="game-panel">
				{
					!props.authenticated &&
					<Link
						to={{
							pathname : "/login/",
							state    : {
								redirect : "game-database/master-game/" + props.game?.id
							}
						}}
						component={
							React.forwardRef((props: any, ref: any) => { // eslint-disable-line
								return (
									<Button className="premium" type="default" onClick={props.navigate}>
										{t("sign_up_game")}
									</Button>
								)
							})
						}
					/>
				}
				{
					props.authenticated &&
					props.tier < 1 &&
					<Link
						to={{
							pathname : "/upgrade/",
							state    : {
								redirect : "game-database/master-game/" + props.game?.id
							}
						}}
						component={
							React.forwardRef((props: any, ref: any) => { // eslint-disable-line
								return (
									<Button className="premium" type="default" onClick={props.navigate}>
										{t("upgrade_game")}
									</Button>
								)
							})
						}
					/>
				}
				{
					props.authenticated &&
					props.tier >= 1 &&
					<>
						<Button className="mr-2" type="default" onClick={() => downloadPGN(props.game?.pgn ?? "")}>{t("download_pgn")}</Button>
						<SaveGame id={props.game?.id}/>
					</>
				}
			</Collapse.Panel>
		</Collapse>
	);
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated,
	tier          : state.Auth.tier
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(Game);