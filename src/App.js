import React, {Component} from "react";
import NebulasLogo from './resources/nebulas.svg';
import "./App.css";
import axios from "axios";
import AppToolBar from './components/AppToolBar';
import MainTab from './components/MainTab.js';
import NebPay from 'nebpay';

const CONTRACT_CONFIG_MAP = {
	MainNet: {
		SMART_CONTRACT_API_GET_ACCOUNT_STATE: 'https://testnet.nebulas.io/v1/user/accountstate',
		SMART_CONTRACT_API_CALL: 'https://mainnet.nebulas.io/v1/user/call',
		CALLER_ADDRESS: 'n1WQH3YqommB2vMCAMp5KjRgRByLfgiqkeq',//n1WQH3YqommB2vMCAMp5KjRgRByLfgiqkeq  Main: n1cdaXYsEHgJUL9Qz9Wd5faNJJBJm27jKe1
		CONTRACT_ADDRESS:'n1kEkxuM6BPkGjrZ6oXWYjQqGfzThXsVGh7',//n1kEkxuM6BPkGjrZ6oXWYjQqGfzThXsVGh7 Main: n1o6FYPiGfmSHp2Xb597sE9vPWWnhodqqYm
		CONTRACT_TX_HASH: 'e8b2186ecf76c895972c2f9f75bb677a62ddb60c63ddce1e1d61751737219ac9'
	},
	TestNet: {
		SMART_CONTRACT_API_GET_ACCOUNT_STATE: 'https://mainnet.nebulas.io/v1/user/accountstate',
		SMART_CONTRACT_API_CALL: 'https://testnet.nebulas.io/v1/user/call',
		CALLER_ADDRESS: 'n1WQH3YqommB2vMCAMp5KjRgRByLfgiqkeq',
		CONTRACT_ADDRESS:'n1w5CDL3ingxVEnSYjfgFU1ABaR1tVK3ooD',
		CONTRACT_TX_HASH: '10e67b8784b5810d5a070eff769a9e5db6c69905b1493cc145edd5e11eb122ef'
	}
};

const GAS_PRICE = "1000000";
const GAS_LIMIT = "200000";


class App extends Component {

    // default state object
    state = {
      knowledgeMap: [],
			accountInfo: {},
      nebPay: {},
			contractNetWorkType: 'TestNet'
    };

    componentDidMount() {
      this.getAllKnowledge();
			this.setState({
				nebPay: new NebPay()
			});
    }

		componentDidUpdate(prevProps, prevState, nextState, snapshot) {
    	if (prevState.contractNetWorkType !== this.state.contractNetWorkType) {
    		this.getAllKnowledge();
			}
		}

    getAccountState = async () => {
      const dataToSend = JSON.stringify({
        address: CONTRACT_CONFIG_MAP[this.state.contractNetWorkType].CALLER_ADDRESS
      });
      return axios.post(CONTRACT_CONFIG_MAP[this.state.contractNetWorkType].SMART_CONTRACT_API_GET_ACCOUNT_STATE, dataToSend);
    };

    getAllKnowledge = async () => {
      const result = await this.getAccountState();
      const accountState = result.data.result;
      const currentNonce = parseInt(accountState.nonce, 10);
      const nextNonce = currentNonce + 1;
      const dataToSend = JSON.stringify({
        from: CONTRACT_CONFIG_MAP[this.state.contractNetWorkType].CALLER_ADDRESS,
        to: CONTRACT_CONFIG_MAP[this.state.contractNetWorkType].CONTRACT_ADDRESS,
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
        .post(CONTRACT_CONFIG_MAP[this.state.contractNetWorkType].SMART_CONTRACT_API_CALL,
          dataToSend)
        .then(response => {
          // normalize data
          const allKnowledge = response.data.result.result.replace(/\\/g, '');
          const data = allKnowledge.substring(1, allKnowledge.length - 1);
          // create an array of contacts only with relevant data
					let newKnowledgeMap = [];
          if (data) {
						newKnowledgeMap = JSON.parse(data).map(c => {
							return {
								id: parseInt(c.contentId, 10),
								authorAddress: c.authorAddress,
								content: c.content,
								numberOfLikes: parseInt(c.numberOfLikes, 10),
								blockHeight: parseInt(c.blockHeight, 10)
							};
						});
					}

          // store the new state object in the component's state
          this.setState({knowledgeMap: newKnowledgeMap});
        })
        .catch(error => console.log(error));
    };

    submitKnowledge = newKnowledge => {
        const to = CONTRACT_CONFIG_MAP[this.state.contractNetWorkType].CONTRACT_ADDRESS;
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
		const to = CONTRACT_CONFIG_MAP[this.state.contractNetWorkType].CONTRACT_ADDRESS;
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
				to: CONTRACT_CONFIG_MAP[this.state.contractNetWorkType].CONTRACT_ADDRESS,
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
				.post(CONTRACT_CONFIG_MAP[this.state.contractNetWorkType].SMART_CONTRACT_API_CALL,
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

	submitNetworkChange = value => {
		this.setState((prevState) => {
			if (prevState.contractNetWorkType !== value) {
				return {contractNetWorkType: value};
			}
		});
	};


    render() {
      return (
        <div className="App">
          <header className="App-header">
            <img src={NebulasLogo} className="App-logo" alt="logo"/>
            <h1 className="App-title">
              Nebulas Knowledge Bank
            </h1>
          </header>
					<div className="AppToolBar-container">
						<AppToolBar submitNetworkChangeRequest={this.submitNetworkChange.bind(this)}/>
					</div>
					<div className="MainTab-container">
						<MainTab
							submitKnowledge={this.submitKnowledge.bind(this)}
							submitLike={this.submitLike.bind(this)}
							searchAddress={this.searchAddress.bind(this)}
							knowledgeMap={this.state.knowledgeMap}
							accountInfo={this.state.accountInfo}
						/>
					</div>
        </div>
      );
    }
}

export default App;
