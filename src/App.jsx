import { useState, useEffect } from 'react';
import Web3 from 'web3';
window.Web3 = Web3;
import { contractABI, contractAddress } from './contractConfig'; // استيراد الإعدادات
import './App.css';
import AdminPanel from './AdminPanel'; // Import the new component
import PublicView from './PublicView'; 

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [owner, setOwner] = useState(''); // لتخزين عنوان المالك

  // Function to initialize web3 and contract instance
  const init = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);          
          // Add these two lines
          const contractOwner = await contractInstance.methods.owner().call();
          setOwner(contractOwner);
        }
      } catch (error) {
        console.error("Could not connect to contract or chain.");
      }
    }
  };

  // Connect to wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        setAccount(accounts[0]);
        init(); // Initialize contract after connecting
      } catch (error) {
        console.error("User rejected the request.");
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  /*// Function to read the owner from the contract
  const getOwner = async () => {
    if (contract) {
      try {
        const contractOwner = await contract.methods.owner().call();
        setOwner(contractOwner);
      } catch (error) {
        console.error("Error fetching owner:", error);
      }
    }
  };
  */

  // Try to initialize on component mount
  useEffect(() => {
    init();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>University Records DApp</h1>
        
        {!account ? (
          <button onClick={connectWallet}>Connect to Wallet</button>
        ) : (
          <div>
            <p>Connected Account: {account}</p>
            {/* --- Diagnostic Line --- */}
            <p style={{ color: 'yellow' }}>Contract Owner State: {owner}</p>
            {/* Show AdminPanel only if the connected account is the owner */}
            {account.toLowerCase() === owner.toLowerCase() && <AdminPanel contract={contract} account={account} />}
            {/* Show the PublicView for any connected user */}
            <PublicView contract={contract} />
        </div>
        )}
    </header>
    </div>
);
}

export default App;