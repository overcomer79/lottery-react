import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    const [manager, players, balance] = await Promise.all([
      lottery.methods.manager().call(),
      lottery.methods.getPlayers().call(),
      web3.eth.getBalance(lottery.options.address)
    ]);
    /*
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    */
    this.setState({
      manager,
      players,
      balance
    });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting for the transaction success..." });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: "You have been enterd!!!" });

  };
  
  onClick = async event => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting for the transaction success..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: "A winner has been picked!" });


  }


  render() {
    /*
    console.log(web3.version);
    web3.eth.getAccounts().then(console.log);
    */
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contrat is managed by {this.state.manager}.
          There are currently {this.state.players.length} entered,
          competing to win {web3.utils.fromWei(this.state.balance)} ether.
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of Ether to Enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
            <button>Enter</button>
          </div>
        </form>

        <hr />
        <div>
          <h3>Ready to pick a winner?</h3>
          <button onClick={this.onClick}>Pick a winner !!!</button>
        </div>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
