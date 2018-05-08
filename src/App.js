import React, {Component} from "react";
import logo from "./logo.svg";
import "./App.css";

import axios from "axios";

import ContactList from "./components/ContactList";

class App extends Component {
    // default state object
    state = {
        contacts: []
    };

    componentDidMount() {
        axios
            .post("https://testnet.nebulas.io/v1/user/call",
                '{"from":"n1WQH3YqommB2vMCAMp5KjRgRByLfgiqkeq","to":"n1iNTrEyBkGWiWc4ivYp5f58C9VRWfPKYnt","value":"0","nonce":5,"gasPrice":"1000000","gasLimit":"200000","contract":{"function":"allKnowledges","args":""}}')
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
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Nebulas</h1>
                </header>

                <ContactList contacts={this.state.contacts}/>
            </div>
        );
    }
}

export default App;
