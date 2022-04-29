import React from "react";

interface PieceProps {
	type: string,
	color: string
}

class Piece extends React.Component<PieceProps> {
	render() {
		return (
			<div className={"standalone piece " + this.props.type + " " + this.props.color}/>
		);
	}
}

export default Piece;