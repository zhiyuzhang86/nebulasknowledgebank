import React, {Component} from "react";
import logo from "./logo.svg";
import "./App.css";
import PropTypes from 'prop-types';
import axios from "axios";

import ContactList from "./components/ContactList";

const TESTNET_GET_ACCOUNT_STATE_CONTRACT = "https://testnet.nebulas.io/v1/user/accountstate";
const TESTNET_CALL_SMART_CONTRACT = "https://testnet.nebulas.io/v1/user/call";
const CALLER_ADDRESS = 'n1WQH3YqommB2vMCAMp5KjRgRByLfgiqkeq';
const CONTRACT_ADDRESS = 'n1iNTrEyBkGWiWc4ivYp5f58C9VRWfPKYnt';
const GAS_PRICE = "1000000";
const GAS_LIMIT = "200000";
class App extends Component {

    static propTypes = {
      isTestNet: PropTypes.bool
    };

    static defaultProps = {
      isTestNet: true
    };

    // default state object
    state = {
        contacts: []
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
      const currentNonce = parseInt(accountInfo.nonce);
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
          var contents = response.data.result.result.replace(/\\/g, '');
          var data = contents.substring(1, contents.length - 1);
          // create an array of contacts only with relevant data
          var i = 0;
          const newContacts = JSON.parse(data).map(c => {
            return {
              id: i++,
              address: c.authorAddress,
              content: c.content,
            };
          });

          // create a new "state" object without mutating
          // the original state object.
          const newState = Object.assign({}, this.state, {
            contacts: newContacts
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
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Knowledge Bank</h1>
                </header>

                <ContactList contacts={this.state.contacts}/>
            </div>
        );
    }
}

export default App;
