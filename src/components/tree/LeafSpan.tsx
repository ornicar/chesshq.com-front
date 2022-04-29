import React from "react";
import { Menu, Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";

import { getClientMoveNumFromDBMoveNum } from "../../helpers";
import ContextMenu from "./LeafSpan/ContextMenu";

interface LeafSpanProps {
	move: any,
	demo: boolean,
	start?: boolean,
	has_children: boolean,
	children_active: boolean,
	active?: boolean,
	first_child?: boolean,
	last_child?: boolean,
	onArrowClick?: any,
	onClick?: Function,
}

class LeafSpan extends React.Component<LeafSpanProps> {
	shouldComponentUpdate(next_props: LeafSpanProps) {
		return (
			this.props.move.id !== next_props.move.id ||
			this.props.has_children !== next_props.has_children ||
			this.props.children_active !== next_props.children_active ||
			this.props.active !== next_props.active ||
			this.props.first_child !== next_props.first_child ||
			this.props.last_child !== next_props.last_child
		);
	}

	render() {
		const classes      = ["select-none transition cursor-pointer px-0.5 rounded-sm"];
		const icon_classes = ["-ml-8 cursor-pointer mr-3 transform transition"];
		const move_num     = getClientMoveNumFromDBMoveNum(this.props.move.moveNumber, "... ", ". ", (this.props.start) ? undefined : "");

		classes.push((this.props.active) ? "bg-green-600" : "hover:bg-blue-800");
		classes.push((move_num.indexOf("...") !== -1 || move_num.indexOf(".") === -1) ? "mr-1.5" : "mr-0.5");

		if (this.props.children_active) {
			icon_classes.push("rotate-90");
		}

		const icon = (this.props.start && this.props.has_children)
			? <FontAwesomeIcon key={"leafspan-icon-" + this.props.move.id} onClick={() => this.props.onArrowClick(this.props.move.id)} className={icon_classes.join(" ")} icon={faChevronCircleRight}/>
			: "";

		const move_prefix = (this.props.move.transpose) ? "(\u2192 " : null;
		const move_suffix = (move_prefix) ? ")" : null;
		const menu        = (
			<Menu>
				<ContextMenu move_id={this.props.move.id} first_child={this.props.first_child} last_child={this.props.last_child}/>
			</Menu>
		);

		return (
			<>
				{icon}
				<Dropdown disabled={this.props.demo} overlay={menu} trigger={["contextMenu"]}>
					<span key={"leafspan-span-" + this.props.move.id} onClick={() => this.props.onClick?.(this.props.move.id)} className={classes.join(" ")}>{move_num}{move_prefix}{this.props.move.move}{move_suffix}</span>
				</Dropdown>
			</>
		)
	}
}

export default LeafSpan;