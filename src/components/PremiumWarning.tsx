import React from "react";
import { Button } from "antd";
import { Translation } from "react-i18next";
import { Link } from "react-router-dom";
import Container from "./premium-warning/Container";

enum PremiumWarningTypes {
	embed = "embed",
	modal = "modal",
}

interface PremiumWarningProps {
	type: keyof typeof PremiumWarningTypes,
	message?: string
}

class PremiumWarning extends React.Component<PremiumWarningProps> {
	render(): JSX.Element {
		return (
			<Container mode={this.props.type}>
				<Translation ns="premium">
					{
						(t) => (
							<>
								<span className="filter text-lg font-semibold" style={{ textShadow: "0 0 5px #000" }}>
									{(this.props.message) ?? t("premium_only")}
								</span>
								<div>
									<Link
										to="/upgrade/"
										component={
											React.forwardRef((props: any, ref: any) => { // eslint-disable-line
												return (
													<Button className="premium" type="default" onClick={props.navigate} style={{ color: "#fff", textShadow: "0 0 4px #000" }}>
														{t("upgrade_now")}
													</Button>
												)
											})
										}
									/>
								</div>
							</>
						)
					}
				</Translation>
			</Container>
		);
	}
}

export default PremiumWarning;