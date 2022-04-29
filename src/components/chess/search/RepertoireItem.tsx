import React from "react";
import { Translation } from "react-i18next";
import { ChessSearchResultItemModel } from "../../../lib/types/models/ChessSearch";

import SearchItem from "./SearchItem";

interface RepertoireItemProps {
	record: ChessSearchResultItemModel
}

class RepertoireItem extends React.Component<RepertoireItemProps> {
	render() {
		const color = (this.props.record.side === 1) ? "gray-200" : "gray-900";

		return (
			<SearchItem route={"/repertoires/" + this.props.record.slug}>
				<div className="flex">
					<Translation ns={["chess", "common"]}>
						{(t) => (
							<>
								<div className="flex flex-1 font-bold items-center">
									<span className={"flex w-3 h-3 mr-1 rounded-md bg-" + color} style={{ backgroundColor: "var(--" + color + ")" }}></span>
									<span className="flex leading-3 h-3 justify-center">{this.props.record.name}</span>
								</div>
								<div className="flex-initial text-right">{this.props.record.moveCount} {t("move", { count : this.props.record.moveCount })}</div>
							</>
						)}
					</Translation>
				</div>
				<div className="text-xs">
					{(new Date(this.props.record.createdAt)).toLocaleDateString()}
				</div>
			</SearchItem>
		)
	}
}

export default RepertoireItem;