import React from "react";
import { useMutation } from "@apollo/client";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { CreateCheckoutMutationData, PlanModel } from "../../lib/types/models/Premium";
import { CREATE_CHECKOUT } from "../../api/queries";

interface ManageProps {
	plan: PlanModel
	current_tier: number
}

enum ButtonType {
	link,
	default,
	text,
	ghost,
	primary,
	dashes
}

function Manage(props: ManageProps) {
	const { t } = useTranslation(["premium"]);
	const [ createCheckout, checkout_res ] = useMutation<CreateCheckoutMutationData>(CREATE_CHECKOUT);

	if (checkout_res.data) {
		window.location.href = checkout_res.data.createCheckout.session.url;
		
		return null;
	}

	let type: keyof typeof ButtonType = "default";
	let text                          = t("upgrade_now");
	let disabled                      = false;

	if (props.plan.tiers.includes(props.current_tier)) {
		type = "primary";
		text = t("manage_subscription");

		if (props.plan.id === "free") {
			disabled = true;
			text     = t("current_plan");
		}
	}

	const highest_tier = props.plan.tiers[props.plan.tiers.length - 1];
	const is_downgrade = props.current_tier > highest_tier;

	if (is_downgrade) {
		type = "ghost";
		text = t("manage_subscription");
	}

	const checkout = () => {
		if (disabled) {
			return;
		}

		createCheckout({
			variables : {
				price : "manage"
			}
		})
	}

	return <Button type={type} disabled={disabled} onClick={checkout}>{text}</Button>;
}

export default Manage;