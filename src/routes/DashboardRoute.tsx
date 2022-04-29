import React from "react";
import { Redirect, useParams } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import { RootState } from "../redux/store";
import { connect, ConnectedProps } from "react-redux";

interface DashboardRouteParams {
	section: string
}

function DashboardRoute(props: PropsFromRedux) {
	const { section } = useParams<DashboardRouteParams>();

	if (!props.authenticated) {
		return <Redirect to={{ pathname : "/login/", state: { redirect : "dashboard/" + section }}}/>;
	}

	return <Dashboard active_section={section}/>;
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(DashboardRoute);