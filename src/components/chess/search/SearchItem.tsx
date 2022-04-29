import React from "react";

interface SearchItemProps {
	route: string
}

class SearchItem extends React.Component<SearchItemProps> {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

export default SearchItem;