import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import HomeIcon from 'material-ui/svg-icons/action/home';
import CreateIcon from 'material-ui/svg-icons/content/create';
import SearchIcon from 'material-ui/svg-icons/action/search';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {blue500, orange500} from "material-ui/styles/colors";


const styles = {
	submitButton: {
		margin: 10,
	},
	errorStyle: {
		color: orange500,
	},
	underlineStyle: {
		borderColor: orange500,
	},
	floatingLabelStyle: {
		color: orange500,
	},
	floatingLabelFocusStyle: {
		color: blue500,
	},
};

const MainTab = (props) => (
	<MuiThemeProvider>
		<Tabs>
			<Tab
				icon={<HomeIcon className="material-icons">Home</HomeIcon>}
				label="HOME"
			>
				<p>Hey you</p>
			</Tab>
			<Tab
				icon={<CreateIcon className="material-icons">Create</CreateIcon>}
				label="CREATE"
			>
				<h1 className="App-textInput">
					<TextField
						floatingLabelText="Please type your knowledge"
						floatingLabelStyle={styles.floatingLabelStyle}
						floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
						underlineStyle={styles.underlineStyle}
						multiLine={true}
						rows={1}
						rowsMax={10}
						fullWidth={true}
					/>
				</h1>
				<h2 className="App-submitButton">
					<RaisedButton
						label="Submit"
						labelPosition="before"
						primary={true}
						icon={<ActionAndroid />}
						style={styles.submitButton}
						onClick={props.submitKnowledege}
					/>
				</h2>
			</Tab>
			<Tab
				icon={<SearchIcon className="material-icons">Search</SearchIcon>}
				label="SEARCH"
			>
				<h1 className="App-textInput">
					<TextField
						floatingLabelText="Please search an address"
						floatingLabelStyle={styles.floatingLabelStyle}
						floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
						underlineStyle={styles.underlineStyle}
						rows={1}
						fullWidth={true}
					/>
				</h1>
				<h2 className="App-searchButton">
					<RaisedButton
						label="Search"
						labelPosition="before"
						primary={true}
						icon={<ActionAndroid />}
						style={styles.submitButton}
						onClick={props.searchAddress}
					/>
				</h2>
			</Tab>
		</Tabs>
	</MuiThemeProvider>
);

export default MainTab;