import React from "react";
import { Button, Form, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/client";
import { EditUserSettingsMutationData, UserSettingsQueryData } from "../../lib/types/models/User";
import { EDIT_USER_SETTINGS, GET_USER_SETTINGS } from "../../api/queries";

interface FormData {
	[key: string]: string
}

function Connections() {
	const [ form ]          = Form.useForm();
	const { t }             = useTranslation(["dashboard", "common"]);
	const loaded_ref        = React.useRef(false);
	const started_ref       = React.useRef(false);
	const { data, loading } = useQuery<UserSettingsQueryData>(GET_USER_SETTINGS, {
		variables : {
			category : "connections"
		}
	});
	const [ updateSetting, update_res ] = useMutation<EditUserSettingsMutationData>(EDIT_USER_SETTINGS);

	const onSubmit = (values: FormData) => {
		const data = [];

		for (const key in values) {
			data.push({
				key      : key,
				category : "connections",
				value    : values[key]
			});
		}

		updateSetting({
			variables : {
				settings : data
			}
		});
	}

	const settings: FormData = {
		chesscom_username : "",
		lichess_username  : ""
	};

	for (const setting of data?.userSettings ?? []) {
		settings[setting.key] = setting.value;
	}

	if (!started_ref.current) {
		started_ref.current = true;
	}

	if (data && started_ref.current && !loaded_ref.current) {
		loaded_ref.current = true;

		form.setFieldsValue(settings);
	}

	return (
		<Spin spinning={loading || update_res.loading}>
			<div className="px-4 pt-2">
				<Form
					id="user-info-form"
					autoComplete="off"
					onFinish={onSubmit}
					form={form}
				>
					<div className="flex flex-wrap gap-x-8">
						<Form.Item
							key={"setting_chesscom_username"}
							label={t("setting_chesscom_username")}
							name={"chesscom_username"}
						>
							<Input/>
						</Form.Item>
						<Form.Item
							key={"setting_lichess_username"}
							label={t("setting_lichess_username")}
							name={"lichess_username"}
						>
							<Input/>
						</Form.Item>
					</div>
					<Form.Item>
						<Button type="default" htmlType="submit">{t("common:save")}</Button>
					</Form.Item>
				</Form>
			</div>
		</Spin>
	);
}

export default Connections;