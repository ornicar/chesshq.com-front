import React from "react";

import Leaf from "./Leaf";
import LeafSpan from "./LeafSpan";

interface BranchProps {
	tree: any,
	demo: boolean,
	root?: boolean,
	active?: boolean,
	active_uuid?: string | null,
	parent_uuid?: string,
	first_child?: boolean,
	last_child?: boolean,
	onMoveClick?: Function
}

interface BranchState {
	child_states: {
		[key: string]: boolean
	}
}

class Branch extends React.PureComponent<BranchProps, BranchState> {
	ref = React.createRef<any>();

	constructor(props: BranchProps) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state  = {
			child_states : {}
		};
	}

	render() {
		const classes = ["p-0 m-0 menu bg-default text-content-700"];
		const html    = (Object.keys(this.props.tree).length === 0) ? null : this.buildHtml(this.props.tree);

		if (!this.props.root) {
			classes.push("pl-2");
			classes.push("ml-1.5");
		} else {
			classes.push("ml-4.5");
		}

		if (!this.props.active) {
			classes.push("hidden");
		}

		return (
			<ul key={"branch-ul-" + this.props.parent_uuid} className={classes.join(" ")} ref={this.ref}>
				{html}
			</ul>
		);
	}

	buildHtml(segment: any, single = false): any {
		if (single || this.props.root) {
			segment = [segment];
		}

		const html  = [];
		const limit = Object.keys(segment).length;
		let count   = 0;

		for (const sort in segment) {
			count++;

			const move         = segment[sort];
			const children     = (move.transpose) ? [] : move.children;
			const child_count  = Object.keys(children).length;
			const active_child = !(this.state.child_states[move.id] === false);
			let active_uuid    = this.props.active_uuid;

			if (child_count > 1) {
				if (!move.uuids.includes(active_uuid)) {
					active_uuid = "";
				}
			}

			const ul = (child_count === 0)
				? ""
				: (
					(child_count > 1)
						? (
							<Branch demo={this.props.demo} key={"branch-" + move.id} parent_uuid={move.id} active={active_child} tree={children} active_uuid={active_uuid} onMoveClick={this.props.onMoveClick}/>
						) :
						this.buildHtml(Object.values(children)[0], true)
				);

			const active = (!move.transpose && this.props.active_uuid === move.id);

			if (single) {
				return (
					<>
						<LeafSpan demo={this.props.demo} key={"leaf-span-" + move.id} active={active} has_children={child_count > 0} children_active={active_child} onArrowClick={this.toggle} move={move} onClick={this.props.onMoveClick}/>
						{active_child && ul}
					</>
				);
			} else {
				const first_child = ((count === 1 && count !== limit) || (this.props.root === true && this.props.first_child === true && count === 1));
				const last_child  = ((count === limit && count !== 1) || (this.props.root === true && this.props.last_child === true && count === 1));

				html.push(
					<Leaf key={"leaf-" + move.id} move={move}>
						<LeafSpan demo={this.props.demo} key={"span-" + move.id} active={active} start={true} has_children={move.has_children} children_active={active_child} move={move} first_child={first_child} last_child={last_child} onArrowClick={this.toggle} onClick={this.props.onMoveClick}/>
						{active_child && ul}
					</Leaf>
				);
			}
		}

		return html;
	}

	toggle(move_id: string) {
		if (!this.ref.current) {
			return;
		}

		const child_states = {...this.state.child_states};

		child_states[move_id] = (child_states[move_id] === false) ? true : false

		this.setState({
			child_states : child_states
		});
	}
}

export default Branch;