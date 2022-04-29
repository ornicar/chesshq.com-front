import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Redirect, RouteProps } from "react-router-dom";
import Login from "../components/Login";
import { LocationState } from "../lib/types/RouteTypes";
import { RootState } from "../redux/store";

function LoginRoute(props: RouteProps & PropsFromRedux) {
	const state: LocationState | undefined = props.location?.state as LocationState | undefined;

	if (props.authenticated && state?.redirect) {
		return <Redirect to={"/" + state.redirect}/>;
	}

	return <Login state={state}/>;
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(LoginRoute);