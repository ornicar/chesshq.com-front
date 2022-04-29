import React from "react";
import { Button } from "antd";
import { Translation } from "react-i18next";
import { Link } from "react-router-dom";

import ProgressBar from "./header/ProgressBar";

import "../../styles/components/home/header.css";

class Header extends React.Component {
	render() {
		return (
			<Translation ns={["repertoires", "premium"]}>
				{
					(t) => (
						<div className="relative">
							<div className="segment one">
								<div className="part one text-2xl md:text-5xl">
									{t("home_cta_one")}
								</div>
								<div className="part two text-2xl md:text-5xl">
									{t("home_cta_two")}
								</div>
							</div>
							<div className="segment two my-4">
								<ProgressBar/>
							</div>
							<div className="segment three">
								<div className="part one">
									{t("home_cta_three")}
								</div>
								<div className="part two">
									<Link
										to="/login/"
										component={
											React.forwardRef((props: any) => {
												return (
													<Button type="default" shape="round" size="large" onClick={props.navigate}>{t("premium:register_now")}</Button>
												)
											})
										}
									/>
								</div>
							</div>
						</div>
					)
				}
			</Translation>
		);
	}
}

export default Header;