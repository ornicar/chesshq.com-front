import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Spin } from "antd";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Collapse, Button, Popconfirm } from "antd";
import { TFunction } from "i18next";

import { CollectionModel, CollectionQueryData } from "../../../lib/types/models/Collection";
import { GET_COLLECTION, EDIT_COLLECTION, DELETE_COLLECTION, GET_COLLECTIONS, CREATE_COLLECTION_GAMES, IMPORT_EXTERNAL_GAMES } from "../../../api/queries";

import AddCollection from "../../modals/AddCollection";
import { hasPremiumLockoutError } from "../../../helpers";
import PremiumWarning from "../../PremiumWarning";
import ImportPGN from "../../modals/AddCollectionGames";
import { RootState } from "../../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import ImportExternalGames, { ExternalGameData } from "../../modals/ImportExternalGames";

interface GameCollectionProps extends PropsFromRedux {
	collection?: CollectionModel
}

function GameCollection(props: GameCollectionProps) {
	const [ modal_active, setModalActive ]                  = useState(false);
	const [ game_modal_active, setGameModalActive ]         = useState(false);
	const [ external_modal_active, setExternalModalActive ] = useState(false);
	const [ deleting, setDeleting ]                         = useState(false);

	const [ editCollection, edit_res ]   = useMutation(EDIT_COLLECTION, {
		refetchQueries : [ GET_COLLECTION ]
	});
	const [ deleteCollection, delete_res ] = useMutation(DELETE_COLLECTION, {
		refetchQueries : [ GET_COLLECTIONS ]
	});
	const [ createCollectionGames, games_res ] = useMutation(CREATE_COLLECTION_GAMES, {
		refetchQueries : [ GET_COLLECTION ]
	});
	const [ importExternalGames, import_res ] = useMutation(IMPORT_EXTERNAL_GAMES, {
		refetchQueries : [ GET_COLLECTION ]
	});

	const { t } = useTranslation(["database", "common", "premium"]);

	const { loading, error, data } = useQuery<CollectionQueryData>(
		GET_COLLECTION,
		{
			variables : {
				slug : props.collection?.slug
			},
			skip        : (props.collection === undefined),
			fetchPolicy : "cache-only"
		}
	);

	const onSubmit = (values: any) => {
		setModalActive(false);
		editCollection({
			variables : {
				...values,
				id : data?.collection?.id
			}
		});
	};

	const onGamesSubmit = (values: any) => {
		setGameModalActive(false);
		createCollectionGames({
			variables : {
				...values,
				collectionId : data?.collection?.id
			}
		});
	};

	const onDelete = () => {
		deleteCollection({
			variables : {
				id : data?.collection?.id
			}
		});
		setDeleting(true);
	}

	const onExternalSubmit = (games: ExternalGameData[]) => {
		setExternalModalActive(false);
		importExternalGames({
			variables : {
				collectionId : data?.collection?.id,
				games        : games
			}
		})
	}

	if (deleting && !delete_res.loading) {
		return (
			<Redirect to="/game-database/"/>
		);
	}

	const premium = hasPremiumLockoutError(games_res.error || import_res.error)
		? <PremiumWarning message={t("premium:collection_game_limit")} type="modal"/>
		: null;

	return (
		<>
			<Collapse bordered={false} activeKey="repertoire-panel">
				<Collapse.Panel showArrow={false} id="repertoire-panel" header={data?.collection?.name} key="repertoire-panel">
					<Spin spinning={error !== undefined || loading || delete_res.loading || edit_res.loading || games_res.loading || import_res.loading}>
						{renderContent(props, t, data?.collection, setModalActive, onDelete, setGameModalActive, setExternalModalActive)}
						<AddCollection type="edit" visible={modal_active} toggleVisible={setModalActive} onSubmit={onSubmit} collection={data?.collection}/>
						{data?.collection && <ImportPGN mode="collection" visible={game_modal_active} toggleVisible={setGameModalActive} onSubmit={onGamesSubmit}/>}
						{
							data?.collection &&
							props.authenticated &&
							props.tier >= 3 &&
							<ImportExternalGames visible={external_modal_active} toggleVisible={setExternalModalActive} onSubmit={onExternalSubmit}/>
						}
					</Spin>
				</Collapse.Panel>
			</Collapse>
			{premium}
		</>
	);
}

function renderContent(props: GameCollectionProps, t: TFunction, collection: CollectionModel | null | undefined, setModalActive: React.Dispatch<React.SetStateAction<boolean>>, onDelete: () => void, setGameModalActive: React.Dispatch<React.SetStateAction<boolean>>, setExternalModalActive: React.Dispatch<React.SetStateAction<boolean>>) {
	return (
		<>
			{
				props.authenticated &&
				props.collection?.userOwned &&
				<div className="flex flex-wrap gap-2">
					<Button type="default" onClick={() => setGameModalActive(true)}>{t("import_pgn")}</Button>
					{
						props.tier >= 3 &&
						<>
							<Button type="ghost" className="flex-nowrap items-center gap-x-1" style={{ display: "flex" }} onClick={() => setExternalModalActive(true)}>
								<div className="flex-initial">{t("database:import")}</div>
								<div className="flex-initial w-4"><img src={process.env.PUBLIC_URL + "/assets/images/third-party/lichess-icon.svg"}/></div>
								<div className="flex-initial"><img className="h-4" src={process.env.PUBLIC_URL + "/assets/images/third-party/chesscom-icon.png"}/></div>
							</Button>
							<Button type="primary" onClick={() => downloadPGN(collection)}>{t("download_pgn")}</Button>
						</>
					}
					<Button type="ghost" onClick={() => setModalActive(true)}>{t("common:edit")}</Button>
					<Popconfirm
						title={t("common:delete_confirm")}
						okText={t("common:yes")}
						cancelText={t("common:cancel")}
						onConfirm={() => onDelete()}
					>
						<Button type="ghost">{t("common:delete")}</Button>
					</Popconfirm>
				</div>
			}
		</>
	);
}

function downloadPGN(collection: CollectionModel | undefined | null) {
	if (!collection) {
		return;
	}

	const pgns = []

	for (const game of collection.games ?? []) {
		pgns.push(game.pgn);
	}

	const blob = new Blob([pgns.join("\n\n") + "\n"], {
		type : "text/plain"
	});
	const url = window.URL.createObjectURL(blob);
	const a   = document.createElement("a");

	a.href     = url;
	a.download = "games.pgn";

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	window.URL.revokeObjectURL(url);
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated,
	tier          : state.Auth.tier
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(GameCollection);