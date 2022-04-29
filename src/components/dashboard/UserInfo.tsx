import React, { useState } from "react";
import { Button, Form, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { auth } from "../../lib/Firebase";
import { updateEmail, updatePassword } from "firebase/auth";
import { notifyError } from "../../helpers";
import { RootState } from "../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import { logout } from "../../redux/slices/auth";
import { Redirect } from "react-router-dom";

function UserInfo(props: PropsFromRedux) {
	const [ processing, setProcessing ] = useState(false);
	const [ logout, setLogout]          = useState(false);
	const { t }                         = useTranslation(["dashboard", "common", "errors"]);
	const onSubmit                      = async (values: any) => {
		if (processing || !auth.currentUser) {
			return;
		}

		setProcessing(true);

		try {
			const email = values.email;

			if (email && email !== auth.currentUser.email) {
				await updateEmail(auth.currentUser, email);
			}

			if (values.password) {
				await updatePassword(auth.currentUser, values.password);
			}

			setProcessing(false);
		} catch (e: any) {
			switch (e.code) {
				case "auth/user-token-expired":
				case "auth/requires-recent-login":
					setLogout(true);
					notifyError("relogin");
					break;

				default:
					notifyError(e.code);
					break;
			}

			setProcessing(false);
		}
	};

	if (logout) {
		props.logout();
		return <Redirect to={{ pathname : "/login/", state: { redirect : "dashboard/user-info" }}}/>;
	}

	return (
		<Spin spinning={processing}>
			<div className="px-4 pt-2">
				<Form
					id="user-info-form"
					onFinish={onSubmit}
					autoComplete="off"
					initialValues={{
						email : auth.currentUser?.email
					}}
				>
					<div className="grid grid-cols-2 gap-x-4">
						<div className="col-span-2 md:col-span-1">
							<Form.Item
								label={t("email")}
								name="email"
								rules={[ { required: true, message: t("input_email")} ]}
							>
								<Input name="email" type="email"/>
							</Form.Item>
						</div>
						<div className="col-span-2 md:col-span-1">
							<Form.Item label={t("password")} name="password">
								<Input type="password"/>
							</Form.Item>
						</div>
					</div>
					<Form.Item>
						<Button type="default" htmlType="submit">{t("common:save")}</Button>
					</Form.Item>
				</Form>
			</div>
		</Spin>
	);
}

const mapStateToProps = (state: RootState) => ({
	token : state.Auth.token
});
const mapDispatchToProps = {
	logout : logout
};
const connector      = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(UserInfo);