import React from 'react';
import PropTypes from "prop-types";
import KnowledgeCard from './KnowledgeCard';

const style = {
	knowledgeCardListContainer: {
		width: '100%',               /* Set width of cards */
		border: '2px solid #EF9A9A',    /* Set up Border */
		overflow: 'scroll',          /* Fixes the corners */
		justifyContent: 'flex-start',
		flexDirection: 'column'
	}
};

const KnowledgeCardList = (props) => (
	<div style={style.knowledgeCardListContainer}>
		{props.knowledgeMap.map(eachKnowledge =>
			<KnowledgeCard key={eachKnowledge.id}
			 	knowledgeContent={eachKnowledge.content}
				authorAddress={eachKnowledge.authorAddress}
				numberOfLikes={eachKnowledge.numberOfLikes}
			/>
		)}
	</div>
);

KnowledgeCardList.propTypes = {
	knowledgeMap: PropTypes.array.isRequired
};

export default KnowledgeCardList;