import React from 'react';
import PropTypes from "prop-types";
import {Card, CardActions, CardHeader, CardText, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import SatisfiedLogo from 'material-ui/svg-icons/social/sentiment-very-satisfied';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
  card: {
		justifyContent: 'flex-start',
		flex: '1 0 500px'
  },
  cardHeader: {
		color: '#D32F2F',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    borderBottom: '1px solid #EF9A9A',
    backgroundColor: '#FFEBEE',
    padding: '2px 4px',
  },
  cardText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px 0',
		fontFamily: 'Open Sans'
  },
  actionButtons: {
    display: 'flex',
		flexWrap: 'wrap',
    flexFlow: 'row',
		fontFamily: 'Open Sans'
  }
};

const KnowledgeCard = (props) => (
  <MuiThemeProvider>
		<Card containerStyle={styles.card}>
			<CardHeader
				title={props.authorAddress}
				subtitle="Created At Time"
        style={styles.cardHeader}
			/>
			<CardText style={styles.cardText}>
				{props.knowledgeContent}
			</CardText>
			<span className={"Likelogo-container"}>
				<SatisfiedLogo />
				<span>{props.numberOfLikes}</span>
			</span>
			<CardActions style={styles.actionButtons}>
				<FlatButton label="Like" />
				<FlatButton label="Reply" />
			</CardActions>
		</Card>

  </MuiThemeProvider>
);

KnowledgeCard.propTypes = {
	authorAddress: PropTypes.string.isRequired,
	knowledgeContent: PropTypes.string.isRequired,
	numberOfLikes: PropTypes.number.isRequired
};

export default KnowledgeCard;