import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router-dom";
import { logout } from "../../redux/slices/auth";

function Logout(props: PropsFromRedux) {
	props.logout();
	return <Redirect to="/"/>;
}

const mapDispatchToProps = {
	logout : logout
};
const connector      = connect(undefined, mapDispatchToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(Logout);