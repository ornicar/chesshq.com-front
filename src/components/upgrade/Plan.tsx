import React from "react";
import { Button, Card, Result } from "antd";
import { useTranslation } from "react-i18next";
import { PlanModel } from "../../lib/types/models/Premium";

import "../../styles/components/upgrade/plan.css";
import { RootState } from "../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_COMMUNICATION_ENROLLMENT, GET_COMMUNICATION_ENROLLMENTS } from "../../api/queries";
import { CommunicationEnrollmentsQueryData } from "../../lib/types/models/User";
import Purchase from "./Purchase";
import Manage from "./Manage";

interface PlanProps extends PropsFromRedux {
	plan: PlanModel
}

function Plan(props: PlanProps) {
	const { t }                                = useTranslation(["premium", "repertoires", "common", "database", "search"]);
	const plan                                 = props.plan;
	const [ createEnrollment, enrollment_res ] = useMutation(CREATE_COMMUNICATION_ENROLLMENT, {
		refetchQueries : [ GET_COMMUNICATION_ENROLLMENTS ]
	});
	const { data }                             = useQuery<CommunicationEnrollmentsQueryData>(GET_COMMUNICATION_ENROLLMENTS);
	const enrollment_name                      = "notify_plan_" + plan.id;

	const onNotify = () => {
		createEnrollment({
			variables : {
				name : enrollment_name
			}
		});
	};

	const has_enrollment = (data?.communicationEnrollments?.filter(x => x.name === enrollment_name).length);
	const unlimited      = t("common:unlimited");
	let action           = null;
	
	if (
		(props.authenticated && plan.tiers.includes(props.tier)) ||
		(props.tier > 0 && plan.available && !plan.tiers.includes(props.tier))
	) {
		action = <Manage plan={props.plan} current_tier={props.tier}/>;
	} else if (plan.available) {
		const ButtonLink = React.forwardRef((props: any) => {
			return (
				<Button key="action" type="default" onClick={props.navigate}>{t("register_now")}</Button>
			)
		});

		action = (props.authenticated)
			? <Purchase plan={props.plan}/>
			: <Link to={{
				pathname : "/login/",
				state    : {
					plan : plan.id
				}}} component={ButtonLink}
			/>;
	} else if (enrollment_res.data && !enrollment_res.error) {
		action = <Result className="subscription-notice-success" status="success" title={t("has_notification_enrollment")}/>;
	} else if (has_enrollment) {
		action = <div>{t("has_notification_enrollment")}</div>;
	} else {
		action = <Button key="action" type="primary" loading={enrollment_res.loading} disabled={!props.authenticated} onClick={onNotify}>{t("notify_when_available")}</Button>;
	}

	const ul = [];

	for (const key in plan.features) {
		const feature  = plan.features[key];
		const sub_li   = [];
		const classes  = ["feature-section"];
		let sub_ul     = null;

		if (feature.limits?.length) {
			for (const limit of feature.limits) {
				sub_li.push(<li key={limit.key}>{t(limit.key, limit.options).replace("-1", unlimited)}</li>);
			}

			sub_ul = <ul className="feature-details">{sub_li}</ul>;
		}

		if (!sub_ul) {
			classes.push("standalone");
		}

		ul.push(
			<li className={classes.join(" ")} key={"feature-" + plan.id + "-" + key}>
				<span>{t(feature.text.key, feature.text.options).replace("-1", unlimited)}</span>
				{sub_ul}
			</li>
		);
	}

	return (
		<Card
			className="feature-card w-full"
			title={t("plan_" + plan.id)}
			cover={
				<div className={"w-full min-w-full bg-no-repeat bg-center mt-6 standalone piece " + plan.piece} style={{ height: "4rem" }}></div>
			}
			actions={[
				action
			]}
		>
			<div className="features">
				{ul}
			</div>
		</Card>
	);
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated,
	tier          : state.Auth.tier
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(Plan);