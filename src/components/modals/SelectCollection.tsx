import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Form, Button, Select, Spin } from "antd";
import { useQuery } from "@apollo/client";
import { GET_COLLECTIONS } from "../../api/queries";
import { CollectionsQueryData } from "../../lib/types/models/Collection";

interface SelectCollectionProps {
	visible : boolean,
	toggleVisible: Function,
	onSubmit: Function
}

function SelectCollection(props: SelectCollectionProps) {
	const { t }                    = useTranslation(["common", "database"]);
	const { loading, error, data } = useQuery<CollectionsQueryData>(GET_COLLECTIONS);
	const onSubmit                 = (values: any) => props.onSubmit(values);
	const options: JSX.Element[]   = [];

	for (const collection of data?.collections ?? []) {
		options.push(
			<Select.Option key={"collection-select-option-" + collection.id} value={collection.id}>
				{collection.name}
			</Select.Option>
		);
	}

	return (
		<Modal
			title={t("database:select_collection")}
			visible={props.visible}
			onCancel={() => props.toggleVisible(false)}
			footer={[
				<Button key="cancel-button" type="ghost" onClick={() => props.toggleVisible(false)}>{t("cancel")}</Button>,
				<Button key="save-button" type="default" form={"select-collection"} htmlType="submit">{t("submit")}</Button>
			]}
		>
			<Spin spinning={loading || error !== undefined}>
				<Form
					id={"select-collection"}
					labelCol={{ span: 3 }}
					onFinish={onSubmit}
					autoComplete="off"
				>
					<Form.Item
						name="collection"
						rules={[ { required: true, message: t("database:input_collection")} ]}
					>
						<Select>
							{options}
						</Select>
					</Form.Item>
				</Form>
			</Spin>
		</Modal>
	);
}

export default SelectCollection;