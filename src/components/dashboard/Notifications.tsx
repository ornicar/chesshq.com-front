import React from "react";
import { Form, Spin, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/client";
import { EditUserSettingMutationData, UserSettingsQueryData } from "../../lib/types/models/User";
import { EDIT_USER_SETTING, GET_USER_SETTINGS } from "../../api/queries";

function Notifications() {
	const { t } = useTranslation("dashboard");
	const { data, loading } = useQuery<UserSettingsQueryData>(GET_USER_SETTINGS, {
		variables : {
			category : "notifications"
		}
	});
	const [ updateSetting, update_res ] = useMutation<EditUserSettingMutationData>(EDIT_USER_SETTING);

	const onChange = (id: number, checked: boolean) => {
		updateSetting({
			variables : {
				id    : id,
				value : String(+checked)
			}
		});
	}

	const items = [];

	for (const setting of data?.userSettings ?? []) {
		const key = "setting_" + setting.key;

		items.push(
			<Form.Item
				key={key}
				label={t(key)}
				name={setting.key}
			>
				<Switch disabled={update_res.loading} onChange={(checked) => onChange(setting.id, checked)} defaultChecked={(setting.value === "1")}></Switch>
			</Form.Item>
		);
	}

	return (
		<Spin spinning={loading}>
			<div className="px-4 pt-2">
				<Form
					id="user-info-form"
					autoComplete="off"
				>
					<div className="flex flex-wrap gap-x-8">
						{items}
					</div>
				</Form>
			</div>
		</Spin>
	);
}

export default Notifications;