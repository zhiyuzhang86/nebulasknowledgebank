import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import HomeIcon from 'material-ui/svg-icons/action/home';
import CreateIcon from 'material-ui/svg-icons/content/create';
import SearchIcon from 'material-ui/svg-icons/action/search';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const MainTab = () => (
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
			/>
			<Tab
				icon={<SearchIcon className="material-icons">Search</SearchIcon>}
				label="SEARCH"
			/>
		</Tabs>
	</MuiThemeProvider>
);

export default MainTab;