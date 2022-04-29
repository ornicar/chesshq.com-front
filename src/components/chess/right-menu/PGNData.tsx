import React from "react";
import { Descriptions } from "antd";
import ChessMaker from "../../../lib/ChessMaker";
import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import { RootState } from "../../../redux/store";
import { connect, ConnectedProps } from "react-redux";

interface PGNDataProps extends PropsFromRedux {
	game?: ChessControllerProps["game"]
}

interface PGNDataState {
	headers?: {
		[key: string] : string | undefined
	}
}

class PGNData extends React.Component<PGNDataProps, PGNDataState> {
	private chess = ChessMaker.create();

	processHeaders(construction?: boolean) {
		this.chess.load_pgn(this.props.game?.pgn || "");

		const header = this.chess.header();

		if (construction) {
			return header;
		}

		this.setState({
			headers : header
		});
	}

	constructor(props: PGNDataProps) {
		super(props);

		const header = this.processHeaders(true);

		this.state = {
			headers : header
		};
	}

	componentDidUpdate(prev_props: PGNDataProps) {
		if (prev_props.game?.id !== this.props.game?.id) {
			this.processHeaders();
		}
	}

	render() {
		if (!this.props.game || !this.state.headers) {
			return null;
		}

		const items: any = [];

		for (const header in this.state.headers) {
			items.push(
				<Descriptions.Item label={header} key={"pgn-header-" + header}>{this.state.headers[header]}</Descriptions.Item>
			);
		}

		return (
			<Descriptions layout="vertical" bordered>
				{items}
			</Descriptions>
		);
	}
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated,
	tier          : state.Auth.tier
});
const connector     = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(PGNData);