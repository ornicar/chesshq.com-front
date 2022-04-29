import React from "react";
import { Translation } from "react-i18next";
import { Link } from "react-router-dom";

class Login extends React.Component {
	render() {
		return (
			<Translation ns="common">
				{
					(t) => <Link to="/login/">{t("login")}</Link>
				}
			</Translation>
		);
	}
}

export default Login;