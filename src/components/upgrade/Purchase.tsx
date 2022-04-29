import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { CREATE_CHECKOUT } from "../../api/queries";
import { CreateCheckoutMutationData, PlanModel } from "../../lib/types/models/Premium";

interface PurchaseProps {
	plan: PlanModel
}

function Purchase(props: PurchaseProps) {
	const [ active, setActive ] = useState("monthly");
	const { t } = useTranslation("premium");
	const [ createCheckout, checkout_res ] = useMutation<CreateCheckoutMutationData>(CREATE_CHECKOUT);

	const toggleActive = (val: string) => {
		setActive(val);
	}

	const checkout = () => {
		createCheckout({
			variables : {
				price : props.plan.id + "_" + active
			}
		})
	}

	const active_classes   = "bg-gray-200 text-gray-900 shadow-inner";
	const inactive_classes = "bg-gray-700 hover:bg-gray-600";
	const monthly_classes  = (active === "monthly") ? active_classes : inactive_classes;
	const yearly_classes   = (active === "yearly") ? active_classes : inactive_classes
	const price            = (active === "monthly") ? props.plan.price_monthly : props.plan.price_yearly;

	if (checkout_res.data) {
		window.location.href = checkout_res.data.createCheckout.session.url;
		
		return null;
	}

	return (
		<div className="grid grid-cols-2 mx-4 gap-x-4">
			<div className="grid grid-cols-2 cursor-pointer text-center">
				<div className={"p-1 rounded-l-xl " + monthly_classes} onClick={() => toggleActive("monthly")}>{t("monthly")}</div>
				<div className={"p-1 rounded-r-xl " + yearly_classes} onClick={() => toggleActive("yearly")}>{t("yearly")}</div>
			</div>
			<div>
				<button className="w-full p-1 rounded-xl bg-yellow-500 hover:bg-yellow-400 focus:bg-yellow-300 text-gray-800" onClick={checkout}>{t("upgrade")} @ ${price}</button>
			</div>
		</div>
	);
}

export default Purchase;