import React, {Component} from "react";
import NebulasLogo from './resources/nebulas.svg';
import "./App.css";
import PropTypes from 'prop-types';
import axios from "axios";
import KnowledegeCardList from './components/KnowledgeCardList';
import MainTab from './components/MainTab.js';
import NebPay from 'nebpay';

const TESTNET_GET_ACCOUNT_STATE_CONTRACT = 'https://testnet.nebulas.io/v1/user/accountstate';
const TESTNET_CALL_SMART_CONTRACT = 'https://testnet.nebulas.io/v1/user/call';
const CALLER_ADDRESS = 'n1WQH3YqommB2vMCAMp5KjRgRByLfgiqkeq';
const CONTRACT_ADDRESS = 'n1iNTrEyBkGWiWc4ivYp5f58C9VRWfPKYnt';
const NEW_CONTRACT_ADDRESS = 'n22caQfAwpgTAbkcLjtMze5Ae891Ure7atu'; // tx hash: 9b76b870f32d54b2ee8df82498b9b9fccc849f9be5e38276ac9ecfd6523cebac
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
      knowledgeMap: [],
      nebPay: {}
    };

    componentDidMount() {
      this.getAllKnowledge();
      this.setState({
        nebPay: new NebPay()
      });
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
        to: NEW_CONTRACT_ADDRESS,
        value: "0",
        nonce: nextNonce.toString(),
        gasPrice: GAS_PRICE,
        gasLimit: GAS_LIMIT,
        contract: {
          function: "allKnowledgesTimeDesc",
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

    submitKnowledge = newKnowledge => {

        const to = NEW_CONTRACT_ADDRESS;
        const value = "0";
        const callFunction = "create";
        const callArgs = '["'+ newKnowledge+'"]';
        const submitOptions = {
            listener: this.onSubmitCompleteListener,
            callback: ''
        };

        const serialNumber = this.state.nebPay.call(to, value, callFunction, callArgs, submitOptions);
        this.state.nebPay.queryPayInfo(serialNumber)
            .then((response) => {
                console.log("tx result: " + response);
                if (response) {
                    const printableObject = JSON.parse(response);
                    console.log(printableObject);
                }
            }).catch((error) => {
            console.log(error);
        });

    };

    onSubmitCompleteListener = (response) => {
        console.log('submit complete');
        console.log(response);
    };

    onSearchCompleteListener = (response) => {
      console.log('search complete');
      console.log(response);
    };

    searchAddress = accountAddress => {
        console.log('searching address');
        console.log(this.state.nebPay);
        console.log(accountAddress);

        const to = NEW_CONTRACT_ADDRESS;
        const value = "0";
        const callFunction = "infoOf";
        const callArgs = "";

        const searchOptions = {
            qrcode: {
                showQRCode: true
            },
            goods: {
                name: "search knowledge",
                desc: "search knowledge"
            },
            listener: this.onSearchCompleteListener,
            callback: ''
        };

        const serialNumber = this.state.nebPay.call(to, value, callFunction, callArgs, searchOptions);
        this.state.nebPay.queryPayInfo(serialNumber)
            .then((response) => {
                console.log("tx result: " + response);
                if (response) {
                    const printableObject = JSON.parse(response);
                    console.log(printableObject);
                }
            }).catch((error) => {
            console.log(error);
        });
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
            <MainTab submitKnowledge={this.submitKnowledge} searchAddress={this.searchAddress}/>
          <KnowledegeCardList knowledgeMap={this.state.knowledgeMap} />
        </div>
      );
    }
}

export default App;
