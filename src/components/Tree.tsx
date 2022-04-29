import React, { useRef } from "react";
import { ApolloClient, useApolloClient, useQuery } from "@apollo/client";

import { GET_REPERTOIRE_MOVES } from "../api/queries";
import { ChessControllerState } from "../lib/types/ChessControllerTypes";
import Branch from "./tree/Branch";

import "../styles/components/tree.css";
import { Spin } from "antd";
import { RepertoireModel, RepertoireMovesQueryData } from "../lib/types/models/Repertoire";
import { getMove, getMoveSimple } from "../helpers";

interface TreeProps {
	repertoire?  : RepertoireModel | null
	active_uuid  : ChessControllerState["last_uuid"],
	mode?        : string,
	onMoveClick? : Function
}

interface BaseTree {
	[move_num: number] : {
		[sort: number] : {
			[key: string | number] : any
		}
	}
}

let base_tree: BaseTree = {};
let tree: any           = {};

function Tree(props: TreeProps) {
	const client       = useApolloClient();
	const prev_rep_ref = useRef<string>();
	const branches     = [];
	const demo         = props.repertoire?.id === -1;

	const { loading, error, data } = useQuery<RepertoireMovesQueryData>(
		GET_REPERTOIRE_MOVES,
		{
			variables : {
				slug : props.repertoire?.slug
			},
			fetchPolicy : "cache-only",
			skip        : (props.repertoire?.slug === undefined || demo)
		}
	);

	if (props.repertoire) {
		const data_string = JSON.stringify(data);
		let moves         = data?.repertoire?.moves;

		if (demo) {
			moves = props.repertoire.moves!;
		}

		if (prev_rep_ref.current !== data_string || demo) {
			base_tree = buildBaseTree(client, moves ?? [], demo);
		}

		prev_rep_ref.current = data_string;

		tree = (Object.keys(base_tree).length > 0) ? buildTree() : {};

		const limit = Object.keys(tree).length;
		let count   = 0;
	
		for (const sort in tree) {
			count++;

			let active_uuid = props.active_uuid;

			if (!tree[sort].uuids.includes(active_uuid)) {
				active_uuid = "";
			}

			branches.push(
				<Branch
					key={"root-branch-" + sort}
					demo={demo}
					root={true}
					active={true}
					tree={tree[sort]}
					active_uuid={active_uuid}
					first_child={count === 1}
					last_child={count === limit}
					onMoveClick={props.onMoveClick}
				/>
			);
		}
	}

	return (
		<Spin spinning={error !== undefined || loading}>
			{branches}
		</Spin>
	);
}

function buildBaseTree(client: ApolloClient<unknown>, moves: RepertoireMovesQueryData["repertoire"]["moves"], demo: boolean) {
	const tree: BaseTree = {};

	for (const move of moves ?? []) {
		const tmp_move: any = {...move};

		if (!tree[tmp_move.moveNumber]) {
			tree[tmp_move.moveNumber] = {};
		}

		tmp_move.moves = [];
		tmp_move.uuids = [tmp_move.id];

		if (tmp_move.transpositionId) {
			const transposition = (!demo) ? getMove(client, tmp_move.transpositionId) : getMoveSimple(moves, tmp_move.transpositionId);

			if (transposition) {
				tmp_move.moves.push({
					sort       : transposition.sort,
					moveNumber : transposition.moveNumber,
					transpose  : true
				});
			}
		}

		tree[tmp_move.moveNumber][tmp_move.sort] = tmp_move;
	}

	for (const move of moves ?? []) {
		const tmp_move = {...move};

		if (!tmp_move.parentId) {
			continue;
		}

		let parent = (!demo) ? getMove(client, tmp_move.parentId) :  getMoveSimple(moves, tmp_move.parentId);

		if (!parent) {
			continue;
		}

		tree[parent.moveNumber][parent.sort].uuids.push(move.id);

		tree[parent.moveNumber][parent.sort].moves.push({
			sort       : tmp_move.sort,
			moveNumber : tmp_move.moveNumber
		});

		let has_children         = false;
		const local_has_children = (tree[parent.moveNumber][parent.sort].moves.length > 1)

		while (parent.parentId) {
			parent = (!demo) ? getMove(client, parent.parentId) : getMoveSimple(moves, parent.parentId);

			if (!parent) {
				break;
			}

			if (local_has_children || tree[parent.moveNumber][parent.sort].moves.length > 1) {
				has_children = true;							
			}

			tree[parent.moveNumber][parent.sort].uuids.push(move.id);
			
			tree[parent.moveNumber][parent.sort].has_children = has_children;
		}
	}

	return tree;
}

function buildTree(move_num = 10, focus_sort?: number, transpose?: boolean) {
	const tree: any     = {};
	const allowed_sorts = (focus_sort !== undefined) ? [focus_sort] : Object.keys(base_tree[move_num]);

	for (const sort of allowed_sorts) {
		const item = base_tree![move_num][sort as number];

		tree[sort] = {
			id           : item.id,
			fen          : item.fen,
			move         : item.move,
			moveNumber   : item.moveNumber,
			has_children : (item.has_children || item.moves.length > 1),
			children     : {},
			transpose    : transpose || false,
			uuids        : item.uuids
		};

		for (const index in item.moves) {
			tree[sort].children = Object.assign(tree[sort].children, buildTree(item.moves[index].moveNumber, item.moves[index].sort, item.moves[index].transpose));
		}
	}

	return tree;
}

export default Tree;