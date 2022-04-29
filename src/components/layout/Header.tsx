import React from "react";
import { Menu, Dropdown, Drawer } from "antd";
import { Translation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";

import i18n from "../../i18n";

import Login from "./Login";

import "../../styles/components/layout/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { RootState } from "../../redux/store";
import { connect, ConnectedProps } from "react-redux";

interface Map {
	[locale: string]: {
		lang: string,
		flag: string
	}
}

const LANGUAGE_MAP: Map = {
	en : {
		lang : "English",
		flag : "GB",
	},
	ja : {
		lang : "日本語",
		flag : "JP"
	}
};

interface HeaderState {
	drawer_visible: boolean
}

class Header extends React.Component<PropsFromRedux, HeaderState> {
	constructor(props: PropsFromRedux) {
		super(props);

		this.state = {
			drawer_visible: false
		};

		this.openDrawer  = this.openDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
	}

	render() {
		return (
			<Translation ns={["common", "repertoires", "openings", "database", "premium"]}>
				{
					(t) => (
						<>
							<div className="w-full py-1 px-6 hidden md:flex items-center">
								<div id="logo" className="w-24 mr-6 z-10" style={{ minWidth: "6rem" }}>
									<Link to="/">
										<img alt="Chess HQ" src="/assets/images/business/logo.png"/>
									</Link>
								</div>
								<nav className="flex flex-1 items-center h-full gap-x-2 lg:gap-x-5 mr-6 text-md">
									<NavLink to="/repertoires/" isActive={(match, location) => {
										return (!!match || ["reviews", "lessons"].includes(location.pathname.split("/")[1]))
									}}>
										{t("repertoires:repertoires")}
									</NavLink>
									<NavLink to={{ pathname: "/openings-explorer/"}}>
										{t("openings:openings_explorer")}
									</NavLink>
									<NavLink to={{ pathname: "/eco-database/"}}>
										{t("openings:eco_database")}
									</NavLink>
									<NavLink to={{ pathname: "/game-database/"}}>
										{t("database:game_database")}
									</NavLink>
									<NavLink to={{ pathname: "/upgrade/"}}>
										{t("premium:upgrade")}
									</NavLink>
								</nav>
								<div className="flex flex-initial items-center h-full">
									{this.renderUserLogin()}
									{this.renderLanguageFlag()}
								</div>
							</div>
							<div className="w-full py-1 px-6 grid grid-cols-2 relative md:hidden">
								<div className="flex items-center h-full z-10">
									<button onClick={this.openDrawer}><FontAwesomeIcon icon={faBars} size="2x"/></button>
								</div>
								<div className="flex items-center h-full justify-end">
								{this.renderUserLogin()}
									{this.renderLanguageFlag()}
								</div>
								<div className="absolute h-full py-2 left-1/2 transform -translate-x-1/2">
									<Link to="/">
										<img className="max-h-full" alt="Chess HQ" src="/assets/images/business/logo.png"/>
									</Link>
								</div>
							</div>
							<Drawer
								title="Chess HQ"
								placement="left"
								visible={this.state.drawer_visible}
								onClose={this.closeDrawer}
								key="navigation-drawer"
								className="max-w-full"
								contentWrapperStyle={{maxWidth : "100%"}}
								drawerStyle={{
									backgroundImage: "url(" + process.env.PUBLIC_URL + "/assets/images/business/logo192-transparent.png)",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center bottom 50px",
								}}
							>
								<Menu activeKey="" selectedKeys={undefined} selectable={false} onClick={this.closeDrawer}>
									<Menu.Item key="menu-item-home">
										<NavLink to="/">
											{t("common:home")}
										</NavLink>
									</Menu.Item>
									<Menu.Item key="menu-item-repertoires">
										<NavLink to="/repertoires/" isActive={(match, location) => {
											return (!!match || ["reviews", "lessons"].includes(location.pathname.split("/")[1]))
										}}>
											{t("repertoires:repertoires")}
										</NavLink>
									</Menu.Item>
									<Menu.Item key="menu-item-openings">
										<NavLink to={{ pathname: "/openings-explorer/"}}>
											{t("openings:openings_explorer")}
										</NavLink>
									</Menu.Item>
									<Menu.Item key="menu-item-openings">
										<NavLink to={{ pathname: "/eco-database/"}}>
											{t("openings:eco_database")}
										</NavLink>
									</Menu.Item>
									<Menu.Item key="menu-item-database">
										<NavLink to={{ pathname: "/game-database/"}}>
											{t("database:game_database")}
										</NavLink>
									</Menu.Item>
									<Menu.Item key="menu-item-upgrade">
										<NavLink to={{ pathname: "/upgrade/"}}>
											{t("premium:upgrade")}
										</NavLink>
									</Menu.Item>
								</Menu>
							</Drawer>
						</>
					)
				}
			</Translation>
		);
	}

	openDrawer() {
		this.setState({
			drawer_visible: true
		});
	}

	closeDrawer() {
		this.setState({
			drawer_visible: false
		});
	}

	renderUserLogin() {
		return (this.props.authenticated) ? this.renderUser() : this.renderLogin();
	}

	renderLogin() {
		return <Login/>;
	}

	renderUser() {
		return (
			<Link to="/dashboard/user-info" className="text-white">
				<FontAwesomeIcon icon={faUser} size="sm"/>
			</Link>
		);
	}

	renderLanguageFlag() {
		const lang = i18n.language;
		const flag = LANGUAGE_MAP[lang]?.flag ?? "GB";

		const menu_items = [];

		for (const locale in LANGUAGE_MAP) {
			if (locale === lang) {
				continue;
			}

			menu_items.push(
				<Menu.Item key={"language-" + locale} onClick={() => this.changeLanguage(locale)}>
					<div className="flex items-center">
						<img id="language-flag" alt={locale} className="mr-2" src={"/assets/images/flags/" + LANGUAGE_MAP[locale].flag + ".png"}/>
						{LANGUAGE_MAP[locale].lang}
					</div>
				</Menu.Item>
			);
		}

		const menu = (
			<Menu>
				{menu_items}
			</Menu>
		);

		return (
			<Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
				<img id="language-flag" alt={lang} className="ml-4 cursor-pointer" src={"/assets/images/flags/" + flag + ".png"}/>
			</Dropdown>
		);
	}

	changeLanguage(locale: string) {
		localStorage.setItem("locale", locale);
		i18n.changeLanguage(locale);
	}
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(Header);