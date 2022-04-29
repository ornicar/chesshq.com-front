import React, { useState } from "react";
import { Translation } from "react-i18next";
import { Menu, Spin, Button } from "antd";
import { useQuery, useMutation } from "@apollo/client";

import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import { CREATE_REPERTOIRE, GET_REPERTOIRES } from "../../../api/queries";
import "../../../styles/components/chess/left-menu/repertoires.css";

import AddRepertoire from "../../modals/AddRepertoire";
import { RepertoiresQueryData } from "../../../lib/types/models/Repertoire";
import Repertoire from "./Repertoires/Repertoire";
import { RootState } from "../../../redux/store";
import { connect, ConnectedProps } from "react-redux";

interface RepertoiresProps extends PropsFromRedux {
	mode : ChessControllerProps["mode"]
}

function Repertoires(props: RepertoiresProps) {
	const [ modal_active, setModalActive ] = useState(false);
	const [ createRepertoire ] = useMutation(CREATE_REPERTOIRE, {
		refetchQueries : [ GET_REPERTOIRES ]
	});
	const { loading, data } = useQuery<RepertoiresQueryData>(
		GET_REPERTOIRES
	);

	const onSubmit = (values: any) => {
		setModalActive(false);
		createRepertoire({
			variables : values
		});
	};

	return (
		<Spin spinning={loading}>
			<Translation ns={["repertoires", "common"]}>
				{
					(t) => (
						<Menu
							id="repertoire-menu"
							mode="inline"
							defaultOpenKeys={["white-repertoires", "black-repertoires"]}
							selectedKeys={[ "repertoire-" + props.repertoire?.id, "repertoire-" + props.mode + "s-" + props.repertoire?.id ]}
						>
							<Menu.Item className="menu-item-button" key="create-repertoire-button" style={{ paddingLeft : 0, marginTop : 0 }}>
								<Button onClick={() => setModalActive(true)}>{t("create_repertoire")}</Button>
							</Menu.Item>
							<Menu.SubMenu title={t("white_repertoires")} key="white-repertoires">
								{renderRepertoires(data, "white")}
							</Menu.SubMenu>
							<Menu.SubMenu title={t("black_repertoires")} key="black-repertoires">
								{renderRepertoires(data, "black")}
							</Menu.SubMenu>
						</Menu>
					)
				}
			</Translation>
			<AddRepertoire type="add" visible={modal_active} toggleVisible={setModalActive} onSubmit={onSubmit}/>
		</Spin>
	);
}

function renderRepertoires(data: RepertoiresQueryData | undefined, color: string) {
	if (!data) {
		return null;
	}

	const items = [];

	for (const repertoire of data.repertoires) {
		if (repertoire.side !== color) {
			continue;
		}

		items.push(
			<Menu.Item key={"repertoire-" + repertoire.id}>
				<Repertoire key={"repertoire-menu-item-" + repertoire.id} id={repertoire.id} slug={repertoire.slug} name={repertoire.name}/>
			</Menu.Item>
		);
	}

	return items;
}

const mapStateToProps = (state: RootState) => ({
	repertoire : state.Chess.repertoire
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(Repertoires);