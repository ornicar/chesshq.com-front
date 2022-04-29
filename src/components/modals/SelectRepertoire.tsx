import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Form, Button, Select, Spin } from "antd";
import { useQuery } from "@apollo/client";
import { GET_REPERTOIRES } from "../../api/queries";
import { RepertoiresQueryData } from "../../lib/types/models/Repertoire";

interface SelectRepertoireProps {
	visible : boolean,
	toggleVisible: Function,
	onSubmit: Function
}

function SelectRepertoire(props: SelectRepertoireProps) {
	const { t }                            = useTranslation(["common", "repertoires", "chess"]);
	const [ side_visible, setSideVisible ] = useState(false);
	const { loading, error, data }         = useQuery<RepertoiresQueryData>(GET_REPERTOIRES);
	const onSubmit                         = (values: any) => props.onSubmit(values);
	const onSelectChange                   = (value: any) => {
		setSideVisible(+value === -1);
	};

	const options: {[side: string]: Array<JSX.Element>} = {
		white : [],
		black : []
	};

	for (const repertoire of data?.repertoires ?? []) {
		if (!["white", "black"].includes(repertoire.side)) {
			continue;
		}

		options[repertoire.side].push(
			<Select.Option key={"repertoire-select-option-" + repertoire.id} value={repertoire.id}>
				{repertoire.name}
			</Select.Option>
		);
	}

	return (
		<Modal
			title={t("repertoires:select_repertoire")}
			visible={props.visible}
			onCancel={() => props.toggleVisible(false)}
			footer={[
				<Button key="cancel-button" type="ghost" onClick={() => props.toggleVisible(false)}>{t("cancel")}</Button>,
				<Button key="save-button" type="default" form={"select-repertoire"} htmlType="submit">{t("submit")}</Button>
			]}
		>
			<Spin spinning={loading || error !== undefined}>
				<Form
					id={"select-repertoire"}
					labelCol={{ span: 3 }}
					onFinish={onSubmit}
					autoComplete="off"
				>
					<Form.Item
						name="repertoire"
						rules={[ { required: true, message: t("repertoires:input_repertoire")} ]}
					>
						<Select onChange={onSelectChange}>
							<Select.OptGroup label={t("new")}>
								<Select.Option value="-1">{t("repertoires:create_repertoire")}</Select.Option>
							</Select.OptGroup>
							{
								options.white.length &&
								<Select.OptGroup label={t("repertoires:white_repertoires")}>
									{options.white}
								</Select.OptGroup>
							}
							{
								options.black.length &&
								<Select.OptGroup label={t("repertoires:black_repertoires")}>
									{options.black}
								</Select.OptGroup>
							}
						</Select>
					</Form.Item>
					{side_visible && (
						<Form.Item
							label={t("chess:side")}
							name="side"
							rules={[ { required: side_visible, message: t("chess:choose_side")} ]}
						>
							<Select>
								<Select.Option value="white">{t("chess:white")}</Select.Option>
								<Select.Option value="black">{t("chess:black")}</Select.Option>
							</Select>
						</Form.Item>
					)}
				</Form>
			</Spin>
		</Modal>
	);
}

export default SelectRepertoire;