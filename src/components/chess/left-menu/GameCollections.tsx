import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, Spin, Button } from "antd";
import { useQuery, useMutation } from "@apollo/client";

import { CREATE_COLLECTION, GET_COLLECTIONS } from "../../../api/queries";
import "../../../styles/components/chess/left-menu/game-collections.css";

import { CollectionsQueryData } from "../../../lib/types/models/Collection";
import AddCollection from "../../modals/AddCollection";
import { hasPremiumLockoutError } from "../../../helpers";
import PremiumWarning from "../../PremiumWarning";
import GameCollection from "./GameCollections/GameCollection";
import { RootState } from "../../../redux/store";
import { connect, ConnectedProps } from "react-redux";

function GameCollections(props: PropsFromRedux) {
	const { t }       = useTranslation(["database", "common", "premium"]);
	const [ modal_active, setModalActive ] = useState(false);
	const [ createCollection, create_res ] = useMutation(CREATE_COLLECTION, {
		refetchQueries : [ GET_COLLECTIONS ]
	});
	const { loading, data } = useQuery<CollectionsQueryData>(
		GET_COLLECTIONS
	);

	const onSubmit = (values: any) => {
		setModalActive(false);
		createCollection({
			variables : values
		});
	};

	const premium = hasPremiumLockoutError(create_res.error)
		? <PremiumWarning type="modal" message={t("premium:created_collection_limit")}/>
		: null;

	return (
		<>
			<Spin spinning={loading}>
				<Menu
					id="collection-menu"
					mode="inline"
					selectedKeys={[ "collection-" + props.collection?.id ]}
				>
					<Menu.Item className="menu-item-button" key="create-collection-button" style={{ paddingLeft : 0, marginTop : 0 }}>
						<Button type="default" onClick={() => setModalActive(true)}>{t("create_collection")}</Button>
					</Menu.Item>
					{renderCollections(data)}
				</Menu>
				<AddCollection type="add" visible={modal_active} toggleVisible={setModalActive} onSubmit={onSubmit}/>
			</Spin>
			{premium}
		</>
	);
}

function renderCollections(data: CollectionsQueryData | undefined) {
	if (!data) {
		return null;
	}

	const items = [];

	for (const collection of data.collections) {
		items.push(
			<Menu.Item key={"collection-" + collection.id}>
				<GameCollection key={"collection-menu-item-" + collection.id} collection={collection}/>
			</Menu.Item>
		);
	}

	return items;
}

const mapStateToProps = (state: RootState) => ({
	collection : state.Chess.collection
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(GameCollections);