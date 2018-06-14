const ReactDOM = require('react-dom'); 
const React = require("react");
const Home = require("./components/Home");
const WilderVoting = require("../helpers/WilderVoting");

const Promise = require('bluebird');
const getWeb3 = require('../helpers/getWeb3');
const WilderStakeInfo = require('../contract-info/WilderStake.json');

// General purpose utility for setting up web3 contract instances.
// It fetches the contract info files which includes the abi, address
// and network location, connects to a web3 provider and instantiates
// the contracts.
const fetchContracts = async (network, contractNames) => {
  const contracts = {};
  let localWeb3 = null;
  
  await Promise.map(contractNames, async name => {
    const contractInfo = WilderStakeInfo;
    if (!localWeb3) {
      const { networkLocation } = contractInfo[network];
      localWeb3 = await getWeb3(networkLocation);
    }

    const { abi, address } = contractInfo[network];
    const contract = localWeb3.eth.Contract
      ? new localWeb3.eth.Contract(abi, '0xAF5419CBD642b4aE9ff9B089fD2B9b9b68f1E4f8') // web3 1.X
      : localWeb3.eth.contract(abi).at('0xAF5419CBD642b4aE9ff9B089fD2B9b9b68f1E4f8'); // web3 0.20.X
    contracts[name] = contract;
    return contractInfo;
  });
  return { contracts };
};
console.log(fetchContracts);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votePending: false,
      votes: null,
      wilderVotes: null,
      wilderPoll: null,
      poll: null
    };
    
    this.propSubmitHandler = async (name, address) => {
      const result = await this.state.wilderPoll.submitProp(name, address);
      console.log(result);
    };

    this.donateHandler = async (amount) => {
      await this.state.wilderPoll.donateEth(amount);
      const money = await this.state.wilderPoll.totalRaised();
      console.log(money);
    };

    this.voteHandler = async (projectIdx) => {
      const result = await this.state.wilderPoll.vote(projectIdx);
      console.log(result);
    };
  }

  async componentDidMount() {
    const { contracts } = await fetchContracts(this.props.network, ["WilderStake"]);
    const wilderPoll = new WilderVoting(contracts.WilderStake);
    const wilderVotes = await wilderPoll.fetchVotes();

    this.setState({
      wilderPoll,
      wilderVotes,
    });
  }

  

  render() {
    return (
      <div style={{ fontFamily: '\'Roboto\', sans-serif'}}>
        <Home
          wilderPoll={this.state.wilderPoll}
          voteHandler={this.voteHandler}
          donateHandler={this.donateHandler}
          propSubmitHandler={this.propSubmitHandler}
          votes={this.state.wilderVotes}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('main')
);
