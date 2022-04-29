import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import RepertoireRoute from "../routes/RepertoireRoute";
import GameDatabaseRoute from "../routes/GameDatabaseRoute";
import ECODatabaseRoute from "../routes/ECODatabaseRoute";

import { ROUTES } from "../helpers";
import Home from "./Home";
import DashboardRoute from "../routes/DashboardRoute";
import LoginRoute from "../routes/LoginRoute";
import UpgradeRoute from "../routes/UpgradeRoute";
import OpeningExplorerRoute from "../routes/OpeningExplorerRoute";

class Container extends React.Component {
	render(): JSX.Element {
		return (
			<Router>
				<MainLayout>				
					<Switch>
						<Route exact path={ROUTES.home}>
							<Home/>
						</Route>

						<Route exact path={ROUTES.repertoires} render={props => <RepertoireRoute {...props} mode="repertoire"/>}/>
						<Route exact path={ROUTES.lessons} render={props => <RepertoireRoute {...props} mode="lesson"/>}/>
						<Route exact path={ROUTES.reviews} render={props => <RepertoireRoute {...props} mode="review"/>}/>

						<Route exact path={ROUTES.openings_explorer}>
							<OpeningExplorerRoute/>
						</Route>

						<Route exact path={ROUTES.eco_database}>
							<ECODatabaseRoute/>
						</Route>

						<Route exact path={ROUTES.game_database}>
							<GameDatabaseRoute/>
						</Route>
						<Route exact path={ROUTES.collection}>
							<GameDatabaseRoute/>
						</Route>
						<Route exact path={ROUTES.collection_game}>
							<GameDatabaseRoute/>
						</Route>
						<Route exact path={ROUTES.master_game}>
							<GameDatabaseRoute/>
						</Route>

						<Route exact path={ROUTES.login} component={LoginRoute}/>
						<Route exact path={ROUTES.dashboard}>
							<DashboardRoute/>
						</Route>

						<Route exact path={ROUTES.upgrade}>
							<UpgradeRoute/>
						</Route>
					</Switch>
				</MainLayout>
			</Router>
		);
	}
}

export default Container;