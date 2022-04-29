import React from "react";

interface LeafProps {
	move: any
}

class Leaf extends React.PureComponent<LeafProps> {
	render() {
		const classes = [
			"mt-1"
		];

		if (this.props.move.has_children) {
			classes.push("pl-5");
			classes.push("-ml-4.5");
			classes.push("branch");
		} else {
			classes.push("-ml-1");
			classes.push("leaf");
		}

		return(
			<li key={"leaf-li" + this.props.move.id} className={classes.join(" ")} data-id={this.props.move.id}>
				{this.props.children}
			</li>
		)
	}
}

export default Leaf;