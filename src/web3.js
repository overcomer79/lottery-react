import Web3 from 'web3';

// the copy of web3 that comes from metamask
const web3 = new Web3(window.web3.currentProvider);

export default web3;