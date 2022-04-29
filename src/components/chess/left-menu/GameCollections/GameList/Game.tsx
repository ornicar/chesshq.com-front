import React from "react";
import { Translation } from "react-i18next";
import { formateDate } from "../../../../../helpers";
import { GameModel } from "../../../../../lib/types/models/Game";

interface GameProps {
	game: GameModel,
	active: boolean
}

class Game extends React.Component<GameProps> {
	render() {
		const classes = [];

		if (this.props.active) {
			classes.push("active-border");
		}

		return (
			<div className={classes.join(" ")}>
				<div className="flex">
					<Translation ns={["chess", "common"]}>
						{(t) => (
							<>
								<div className="flex-1 font-bold">{this.props.game.name.replace("N/A", t("common:unknown"))}</div>
								<div className="flex-initial text-right">{this.props.game.result ?? "N/A"}</div>
							</>
						)}
					</Translation>
				</div>
				<div className="text-xs">
					{formateDate(this.props.game.date)}
					{this.renderEvent()}
					{this.renderRound()}
				</div>
			</div>
		)
	}

	renderEvent() {
		const prefix = (this.props.game.date) ? ", " : "";

		return (this.props.game.event) ? prefix + this.props.game.event : null;
	}

	renderRound() {
		const prefix = (this.props.game.event) ? ", " : "";

		return (this.props.game.round) ? prefix + this.props.game.round : null;
	}
}

export default Game;