import React, {Component} from 'react';
import PropTypes from "prop-types";
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


const styles = {
	toolbar: {
		backgroundColor: "#00bcd4"
	}
};
class AppToolBar extends Component {

	state = {
		dropdownValue: 'TestNet'
	};

	static propTypes = {
		submitNetworkChangeRequest: PropTypes.func,
	};

	static defaultProps = {
		submitNetworkChangeRequest() {}
	};

	handleDropdownChange = (event, index, value) => {
		this.setState({
			dropdownValue: value
		});
		this.props.submitNetworkChangeRequest(value);
	};

	render() {
		return (
			<MuiThemeProvider>
				<Toolbar style={styles.toolbar}>
					<ToolbarGroup firstChild={true}>
						<DropDownMenu value={this.state.dropdownValue} onChange={this.handleDropdownChange}>
							<MenuItem value={"MainNet"} primaryText="Main Net" />
							<MenuItem value={"TestNet"} primaryText="Test Net" />
						</DropDownMenu>
					</ToolbarGroup>
				</Toolbar>
			</MuiThemeProvider>
		);
	}
}

export default AppToolBar;