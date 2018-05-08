import React, {Component} from "react";
import logo from "./resources/logo.svg";
import NebulasLogo from './resources/nebulas.svg';
import "./App.css";
import PropTypes from 'prop-types';
import axios from "axios";
import TextField from 'material-ui/TextField';
import KnowledegeCardList from "./components/KnowledgeCardList";
import {orange500, blue500} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';


const TESTNET_GET_ACCOUNT_STATE_CONTRACT = "https://testnet.nebulas.io/v1/user/accountstate";
const TESTNET_CALL_SMART_CONTRACT = "https://testnet.nebulas.io/v1/user/call";
const CALLER_ADDRESS = 'n1WQH3YqommB2vMCAMp5KjRgRByLfgiqkeq';
const CONTRACT_ADDRESS = 'n1iNTrEyBkGWiWc4ivYp5f58C9VRWfPKYnt';
const GAS_PRICE = "1000000";
const GAS_LIMIT = "200000";

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

class App extends Component {

    static propTypes = {
      isTestNet: PropTypes.bool
    };

    static defaultProps = {
      isTestNet: true
    };

    // default state object
    state = {
      knowledgeMap: []
    };

    componentDidMount() {
      this.getAllKnowledge();
    }

    getAccountState = async () => {
      const dataToSend = JSON.stringify({
        address: CALLER_ADDRESS
      });
      return axios.post(TESTNET_GET_ACCOUNT_STATE_CONTRACT, dataToSend);
    };

    getAllKnowledge = async () => {

      const result = await this.getAccountState();
      const accountInfo = result.data.result;
      const accountBalance = parseFloat(accountInfo.balance);
      const currentNonce = parseInt(accountInfo.nonce, 10);
      const nextNonce = currentNonce + 1;
      const dataToSend = JSON.stringify({
        from: CALLER_ADDRESS,
        to: CONTRACT_ADDRESS,
        value: "0",
        nonce: nextNonce.toString(),
        gasPrice: GAS_PRICE,
        gasLimit: GAS_LIMIT,
        contract: {
          function: "allKnowledges",
          args: ""
        }
      });
      axios
        .post(TESTNET_CALL_SMART_CONTRACT,
          dataToSend)
        .then(response => {
          // normalize data
          const allKnowledge = response.data.result.result.replace(/\\/g, '');
          const data = allKnowledge.substring(1, allKnowledge.length - 1);
          // create an array of contacts only with relevant data
          let index = 0;

          const newKnowledgeMap = JSON.parse(data).map(c => {
            return {
              id: index++,
              address: c.authorAddress,
              content: c.content,
              numberOfLikes: parseInt(c.numberOfLikes, 10),
              blockHeight: parseInt(c.blockHeight, 10)
            };
          });

          // create a new "state" object without mutating
          // the original state object.
          const newState = Object.assign({}, this.state, {
            knowledgeMap: newKnowledgeMap
          });

          // store the new state object in the component's state
          this.setState(newState);
        })
        .catch(error => console.log(error));
    };

    render() {
      return (
        <div className="App">
          <header className="App-header">
            <img src={NebulasLogo} className="App-logo" alt="logo"/>
            <h1 className="App-title">
              Knowledge Bank
            </h1>
          </header>
          <h1 className="App-textInput">
						<MuiThemeProvider>
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
						</MuiThemeProvider>
          </h1>
					<h2 className="App-submitButton">
						<MuiThemeProvider>
							<RaisedButton
								label="Submit"
								labelPosition="before"
								primary={true}
								icon={<ActionAndroid />}
								style={styles.submitButton}
							/>
						</MuiThemeProvider>
					</h2>
          <KnowledegeCardList knowledgeMap={this.state.knowledgeMap} />
        </div>
      );
    }
}

export default App;
