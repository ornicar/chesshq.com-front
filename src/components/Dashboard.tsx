import React from "react";
import { Menu } from "antd";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import "../styles/components/dashboard.css";
import UserInfo from "./dashboard/UserInfo";
import Logout from "./dashboard/Logout";
import Notifications from "./dashboard/Notifications";
import { RootState } from "../redux/store";
import { connect, ConnectedProps } from "react-redux";
import Connections from "./dashboard/Connections";
import PremiumWarning from "./PremiumWarning";

interface DashboardProps extends PropsFromRedux {
	active_section: string
}

const MENU = [
	{
		slug     : "user-info",
		i18n_key : "user_info"
	},
	{
		slug     : "notifications",
		i18n_key : "notifications"
	},
	{
		slug     : "connections",
		i18n_key : "connections",
		tier     : 1
	},
	{
		slug     : "logout",
		i18n_key : "logout"
	}
];

function Dashboard(props: DashboardProps): JSX.Element {
	const { t } = useTranslation("dashboard");
	const items = [];

	for (const item of MENU) {
		if (item.tier !== undefined && props.tier < item.tier) {
			continue;
		}

		items.push(
			<Menu.Item key={"dashboard-menu-item-" + item.slug}>
				<NavLink className="font-bold" to={"/dashboard/" + item.slug}>{t(item.i18n_key)}</NavLink>
			</Menu.Item>
		)
	}

	return (
		<div id="dashboard-container" className="p-6 grid grid-cols-12 gap-4">
			<div className="col-span-12 md:col-span-2">
				<Menu selectedKeys={["dashboard-menu-item-" + props.active_section]}>
					{items}
				</Menu>
			</div>
			<div className="col-span-12 md:col-span-10">
				{renderComponent(props.active_section, props.tier)}
			</div>
		</div>
	);
}

function renderComponent(section: string, tier: number) {
	switch (section) {
		case "user-info":
			return <UserInfo/>;

		case "notifications":
			return <Notifications/>;

		case "connections":
			if (tier < 3) {
				return <PremiumWarning type="embed"/>
			}

			return <Connections/>;

		case "logout":
			return <Logout/>;

		default:
			break;
	}
}

const mapStateToProps = (state: RootState) => ({
	tier : state.Auth.tier
});
const connector     = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Dashboard);