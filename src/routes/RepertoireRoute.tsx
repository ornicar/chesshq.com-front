import React, { useState } from "react";
import { Redirect, RouteProps, useParams } from "react-router-dom";
import { useQuery, useMutation, ApolloConsumer } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import { GET_REPERTOIRE, GET_REPERTOIRE_QUEUES, CREATE_REPERTOIRE_MOVE, TRANSPOSE_REPERTOIRE_MOVE, CREATE_REVIEW, CREATE_REPERTOIRE_MOVE_ARROW_DATUM } from "../api/queries";
import ChessController from "../controllers/ChessController";
import { ChessControllerProps } from "../lib/types/ChessControllerTypes";
import { RepertoireMoveModel, RepertoireQueryData, RepertoireReviewModel } from "../lib/types/models/Repertoire";
import { createRepertoireRouteMeta, hasPremiumLockoutError } from "../helpers";
import { ChessState } from "../lib/types/ReduxTypes";
import { setRepertoire } from "../redux/slices/chess";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../redux/store";
import PremiumWarning from "../components/PremiumWarning";
import { ForcedArrows } from "../lib/types/models/Chessboard";

interface RepertoireRouteProps extends PropsFromRedux, RouteProps {
	mode: ChessControllerProps["mode"]
}
interface RepertoireRouteParams {
	slug?: string
}

// TODO:
// Add backup route-level cache that holds moves by ID's to use for lookup in tree building in case a subsequent move
// is not in the GET_REPERTOIRE data if a user completes another move before the query request is complete (race condition).
// May be mitigatable from Apollo manual recaching in the CREATE_MOVE mutation, but need to see if the recache occurs before
// or after the mutation request. If after, the possibility of a race condition still exists, so a route-level cache is needed.

function RepertoireRoute(props: RepertoireRouteProps) {
	const { t }    = useTranslation(["repertoires", "premium"]);
	const { slug } = useParams<RepertoireRouteParams>();

	let main_query   = GET_REPERTOIRE;
	let require_auth = false;

	switch (props.mode) {
		case "repertoire":
			main_query = GET_REPERTOIRE;

			if (!slug) {
				require_auth = true;
			}

			break;

		case "lesson":
		case "review":
			main_query   = GET_REPERTOIRE_QUEUES;
			require_auth = true;

			break;
	}

	const [ createMove, create_move_res ] = useMutation(CREATE_REPERTOIRE_MOVE);
	const [ createArrow ] = useMutation(CREATE_REPERTOIRE_MOVE_ARROW_DATUM);
	const [ transposeMove ] = useMutation(TRANSPOSE_REPERTOIRE_MOVE);
	const [ createReview ] = useMutation(CREATE_REVIEW, {
		refetchQueries : [ main_query ]
	});
	const { data } = useQuery<RepertoireQueryData>(
		main_query,
		{
			variables : {
				slug : slug
			},
			skip        : !slug,
			fetchPolicy : (props.mode === "lesson") ? "network-only" : "cache-first"
		}
	);
	const [ move_searching, setMoveSearching ] = useState<boolean>(false);

	if (require_auth && !props.authenticated) {
		let path = props.location?.pathname;

		if (path?.[0] === "/") {
			path = path.slice(1);
		}

		return <Redirect to={{ pathname : "/login/", state : { redirect : path }}}/>;
	}

	props.setRepertoire(data?.repertoire);

	const fens: { [key: string]: string } = {};
	const arrows: ForcedArrows = {};

	if (data?.repertoire?.moves) {
		for (const move of data?.repertoire.moves) {
			const fen_key = move.moveNumber + ":" + move.move + ":" + move.fen;

			fens[fen_key] = move.id;

			if (!arrows[move.id]) {
				arrows[move.id] = [];
			}

			const parent_id = move.parentId || "root";

			if (!arrows[parent_id]) {
				arrows[parent_id] = [];
			}

			arrows[parent_id].push(move.uci);
		}
	}

	const addMove = function(move_data: any) {
		createMove({
			variables : {
				id           : move_data.id,
				repertoireId : data?.repertoire?.id,
				moveNumber   : move_data.move_num,
				move         : move_data.move,
				fen          : move_data.fen,
				uci          : move_data.uci,
				parentId     : move_data.parent_id
			}
		});
	}

	const setTransposition = function(current_uuid: RepertoireMoveModel["id"], prev_uuid: RepertoireMoveModel["id"]) {
		transposeMove({
			variables : {
				id              : prev_uuid,
				transpositionId : current_uuid
			}
		});
	}

	const doReview = function(review: RepertoireReviewModel) {
		createReview({
			variables : review
		});
	}

	const onMoveSearchChange = function(new_state: boolean) {
		setMoveSearching(new_state);
	}

	const draw = function(move_id: RepertoireMoveModel["id"], data: string[]) {
		createArrow({
			variables : {
				moveId : move_id,
				data   : data
			}
		});
	}

	const meta    = createRepertoireRouteMeta(t, props.mode, data?.repertoire);
	const premium = hasPremiumLockoutError(create_move_res.error)
		? <PremiumWarning type="modal" message={t("premium:created_position_limit")}/>
		: null;

	return (
		<>
			<Helmet>
				<title>{meta.title}</title>
				<meta name="description" content={meta.description}/>
				<link rel="canonical" href={meta.url}/>
				<meta property="og:title" content={meta.og_title}/>
				<meta property="og:description" content={meta.description}/>
				<meta property="og:url" content={meta.url}/>
				<meta property="twitter:title" content={meta.og_title}/>
				<meta property="twitter:description" content={meta.description}/>
			</Helmet>
			<ApolloConsumer>
				{client => 
					<ChessController
						demo={false}
						key="chess-controller"
						mode={(move_searching) ? "search" : props.mode}
						repertoire={data?.repertoire}
						client={client}
						onMove={addMove}
						onTransposition={setTransposition}
						onReview={doReview}
						arrows={arrows}
						onMoveSearchChange={onMoveSearchChange}
						onDraw={draw}
					/>
				}
			</ApolloConsumer>
			{premium}
		</>
	)
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated
});
const mapDispatchToProps = {
	setRepertoire : (repertoire: ChessState["repertoire"]) => setRepertoire(repertoire)
};
const connector      = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(RepertoireRoute);