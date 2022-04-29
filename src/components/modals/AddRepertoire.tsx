import React from "react";
import { Translation } from "react-i18next";
import { Modal, Form, Input, Button, Select, Switch } from "antd";
import { RepertoireModel } from "../../lib/types/models/Repertoire";

enum AddRepertoireTypes {
	add  = "add",
	edit = "edit",
}

interface AddRepertoireProps {
	type: keyof typeof AddRepertoireTypes,
	visible : boolean,
	toggleVisible: Function,
	onSubmit: Function,
	repertoire?: RepertoireModel | null
}

class AddRepertoire extends React.PureComponent<AddRepertoireProps> {
	constructor(props: AddRepertoireProps) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		const title_key = (this.props.type === "add") ? "create" : "edit";
		const save_text = (this.props.type === "add") ? "create" : "save";

		return (
			<Translation ns={["common", "repertoires", "chess"]}>
				{
					(t) => (
						<Modal
							title={t("repertoires:" + title_key + "_repertoire")}
							visible={this.props.visible}
							onCancel={() => this.props.toggleVisible(false)}
							footer={[
								<Button key="cancel-button" type="ghost" onClick={() => this.props.toggleVisible(false)}>{t("cancel")}</Button>,
								<Button key="save-button" type="default" form={this.props.type + "-repertoire"} htmlType="submit">{t(save_text)}</Button>
							]}
						>
							<Form
								id={this.props.type + "-repertoire"}
								labelCol={{ span: 3 }}
								onFinish={this.onSubmit}
								autoComplete="off"
								initialValues={{
									name   : this.props.repertoire?.name,
									side   : null,
									public : this.props.repertoire?.public ?? false
								}}
							>
								<Form.Item
									label={t("name")}
									name="name"
									rules={[ { required: true, message: t("input_name")} ]}
								>
									<Input/>
								</Form.Item>
								{this.props.type === "add" && (
									<Form.Item
										label={t("chess:side")}
										name="side"
										rules={[ { required: true, message: t("chess:choose_side")} ]}
									>
										<Select>
											<Select.Option value="white">{t("chess:white")}</Select.Option>
											<Select.Option value="black">{t("chess:black")}</Select.Option>
										</Select>
									</Form.Item>
								)}
								<Form.Item
									label={t("public")}
									name="public"
								>
									<Switch defaultChecked={this.props.repertoire?.public ?? false}/>
								</Form.Item>
							</Form>
						</Modal>
					)
				}
			</Translation>
		);
	}

	onSubmit(values: any) {
		if (!values.public) {
			values.public = false;
		}

		this.props.onSubmit(values);
	}
}

export default AddRepertoire;