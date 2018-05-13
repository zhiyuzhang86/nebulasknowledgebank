import React, {Component} from "react";
import NebulasLogo from './resources/nebulas.svg';
import "./App.css";
import PropTypes from 'prop-types';
import axios from "axios";
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
			accountInfo: {},
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
      const accountState = result.data.result;
      const currentNonce = parseInt(accountState.nonce, 10);
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
              authorAddress: c.authorAddress,
              content: c.content,
              numberOfLikes: parseInt(c.numberOfLikes, 10),
              blockHeight: parseInt(c.blockHeight, 10)
            };
          });

          // store the new state object in the component's state
          this.setState({knowledgeMap: newKnowledgeMap});
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

	submitLike = contentID => {
		const to = NEW_CONTRACT_ADDRESS;
		const value = "0";
		const callFunction = "likeIdea";
		const callArgs = '["'+ contentID +'"]';
		const submitOptions = {
			listener: this.onLikeCompleteListener,
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
        console.log('Submit complete');
        console.log(response);
    };

    onLikeCompleteListener = (response) => {
      console.log('Like complete');
      console.log(response);
    };

    searchAddress = async (accountAddress) => {
			const result = await this.getAccountState();
			const accountState = result.data.result;
			const currentNonce = parseInt(accountState.nonce, 10);
			const nextNonce = currentNonce + 1;
			const dataToSend = JSON.stringify({
				from: accountAddress,
				to: NEW_CONTRACT_ADDRESS,
				value: "0",
				nonce: nextNonce.toString(),
				gasPrice: GAS_PRICE,
				gasLimit: GAS_LIMIT,
				contract: {
					function: "infoOf",
					args: ""
				}
			});

			axios
				.post(TESTNET_CALL_SMART_CONTRACT,
					dataToSend)
				.then(response => {
					// normalize data
					const data = JSON.parse(response.data.result.result.replace(/\\/g, ''));

					const accountInfo = {
						authorAddress: accountAddress,
						numberOfLikes: parseInt(data.totalLikes, 10),
						amount: parseInt(data.totalBalance, 10)
					};
					this.setState({accountInfo: accountInfo});

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
            <MainTab
              submitKnowledge={this.submitKnowledge}
							submitLike={this.submitLike}
              searchAddress={this.searchAddress}
              knowledgeMap={this.state.knowledgeMap}
              accountInfo={this.state.accountInfo}
            />
        </div>
      );
    }
}

export default App;
