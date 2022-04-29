import { gql } from "@apollo/client";

export const TYPES = gql`
	type CriteriaItem {
		movelist: String
		fen: String
		eco: String
		side: String
	}

	type Criteria {
		mode: String!
		data: CriteriaItem!
	}
`;