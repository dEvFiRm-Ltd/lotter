import Lottery from "./contracts/Lottery.json";
import React from 'react';
import getWeb3 from "./getWeb3";
import "./App.css";


function Myapp() {
  const [storageVlue, setStorageVlaue] = React.useState(0);
  const [web3, setWeb3] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [contract, setContract] = React.useState(null);
  const [networkType, setNetworkType] = React.useState(null);
  const [balance, setBalance] = React.useState(0);
  const [managerAccount, setManagerAccount] = React.useState(null);
  const fetchData = async () => {

    try {

      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      let balance = await web3.eth.getBalance(accounts[0]);

      const deployedNetwork = Lottery.networks[networkId];
      const instance = new web3.eth.Contract(
        Lottery.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setWeb3(web3);
      setBalance(await web3.utils.fromWei(balance, 'ether'));
      setNetworkType(await web3.eth.net.getNetworkType());
      console.log('here');
      setAccount(accounts);
      setContract(instance);
      setStorageVlaue(await instance.methods.getBlancd().call());
      let data = await instance.methods.manager().call();
      setManagerAccount(data);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

  }
  React.useEffect(() => {
    fetchData();
  }, []);
  

  window.ethereum.on('accountsChanged', (accounts) => {
    setAccount(accounts);
    if (web3) {
      web3.eth.getBalance(accounts[0]).then(function (balance) {
        setBalance(web3.utils.fromWei(balance, 'ether'));
      });
    }
  })
 
  window.ethereum.on('chineChange', function (networkId) {
    fetchData();
  })

  

  // all contract functions
  const sendEther = async () => {
    await contract.methods.payEthe().send({
      from: account[0],
      value: web3.utils.toWei('1', 'ether'),
    });
    getBlancd();
    console.log(contract._address);
    connectMetaMask();
  }
  const getBlancd = async () =>{
    let balance = await contract.methods.getBlancd().call();
    setStorageVlaue(await web3.utils.fromWei(balance, 'ether'));

  } 

    

  const winnerSelect = async () => {
    manager();
    try {
      
      if(managerAccount === account[0]){
      let data = await contract.methods.winnerSelect().send({
        from: account[0],
      });

      console.log(data);
      getBlancd();
      }else{
        alert("you are not manager");
      }
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
    connectMetaMask();
  }

  const manager = async () => {
    try {
      let data = await contract.methods.manager().call();
      setManagerAccount(data);
      console.log(data);
      return data;

    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }
  const customer = async () => {
    try {
      let data = await contract.methods.costmerList(1).call();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const connectMetaMask = async () => {
    setAccount(await web3.eth.getAccounts());
    let networkId = await web3.eth.net.getId();
    console.log(networkId);
    setNetworkType(await web3.eth.net.getNetworkType());
    console.log(networkType);
    console.log(account);
    let balance = await web3.eth.getBalance(account[0]);
    setBalance(await web3.utils.fromWei(balance, 'ether'));
  }

  // if(managerAccount !== account){
  //   connectMetaMask();
  // }
  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">

      <div>The stored value is: {storageVlue}  ether</div>
      <p>Account Number: {account}</p>
      <p>Network Type: {networkType}</p>
      <p>Balance: {balance} ETH</p>
      <button onClick={connectMetaMask}>connect metaMask</button>

      <button onClick={sendEther}>sendEther</button>
      <button onClick={getBlancd}>getBlancd</button>
      <button onClick={winnerSelect}>winnerSelect</button>
      <button onClick={manager}>manager</button>
      <button onClick={customer}>customer</button>

      <br />

    </div>
  )
}

export default Myapp;

