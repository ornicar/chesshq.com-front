import React from "react";
import { Translation } from "react-i18next";
import { Modal, Form, Input, Button } from "antd";
import { CollectionModel } from "../../lib/types/models/Collection";

enum AddCollectionTypes {
	add  = "add",
	edit = "edit",
}

interface AddCollectionProps {
	type: keyof typeof AddCollectionTypes,
	visible : boolean,
	toggleVisible: Function,
	onSubmit: Function,
	collection?: CollectionModel | null
}

class AddCollection extends React.PureComponent<AddCollectionProps> {
	constructor(props: AddCollectionProps) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		const title_key = (this.props.type === "add") ? "create" : "edit";
		const save_text = (this.props.type === "add") ? "create" : "save";

		return (
			<Translation ns={["common", "database", "chess"]}>
				{
					(t) => (
						<Modal
							title={t("database:" + title_key + "_collection")}
							visible={this.props.visible}
							onCancel={() => this.props.toggleVisible(false)}
							footer={[
								<Button key="cancel-button" type="ghost" onClick={() => this.props.toggleVisible(false)}>{t("cancel")}</Button>,
								<Button key="save-button" type="default" form={this.props.type + "-collection"} htmlType="submit">{t(save_text)}</Button>
							]}
						>
							<Form
								id={this.props.type + "-collection"}
								labelCol={{ span: 3 }}
								onFinish={this.onSubmit}
								autoComplete="off"
								initialValues={{
									name : this.props.collection?.name
								}}
							>
								<Form.Item
									label={t("name")}
									name="name"
									rules={[ { required: true, message: t("input_name")} ]}
								>
									<Input/>
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

export default AddCollection;