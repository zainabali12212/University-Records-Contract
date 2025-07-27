import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractABI, contractAddress } from './contractConfig';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [studentIdSearch, setStudentIdSearch] = useState('');
  const [studentReport, setStudentReport] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');

  // Function to initialize web3 and contract instance
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);

          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Could not connect to contract or chain.");
        }
      }
    };
    init();
  }, []);

  // Connect to wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User rejected the request.");
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  // The new comprehensive search function
  const handleFullReportSearch = async (event) => {
    event.preventDefault();
    if (!contract || !studentIdSearch) return;
    
    setStudentReport(null);
    setSearchMessage('Searching...');

    try {
      const report = await contract.methods.getStudentFullReport(studentIdSearch).call();
      
      // Check if the student was found
      if (report.studentDetails.isCreated) {
        setStudentReport(report);
        setSearchMessage('');
      } else {
        setSearchMessage('Student not found.');
      }
    } catch (error) {
      console.error("Error fetching full report:", error);
      setSearchMessage('An error occurred while fetching the report.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>University Records Viewer</h1>
        
        {!account ? (
          <button onClick={connectWallet}>Connect to Wallet</button>
        ) : (
          <div>
            <p>Connected Account: {account}</p>
            
            <hr />

            {/* Final Search Form */}
            <form onSubmit={handleFullReportSearch}>
              <h3>Search for a Student's Full Report</h3>
              <input 
                type="number"
                placeholder="Enter Student ID"
                value={studentIdSearch}
                onChange={(e) => setStudentIdSearch(e.target.value)}
                required
              />
              <button type="submit">Search</button>
            </form>

            {searchMessage && <p>{searchMessage}</p>}

            {/* Display the full report */}
            {studentReport && (
              <div className="report-container">
                <h2>Student Report</h2>

                {/* Student Details */}
                <div className="report-section">
                  <h3>Personal Information</h3>
                  <p><strong>ID:</strong> {studentReport.studentDetails.studentId}</p>
                  <p><strong>Name:</strong> {studentReport.studentDetails.fullName}</p>
                  <p><strong>Enrollment Year:</strong> {studentReport.studentDetails.enrollmentYear}</p>
                </div>

                {/* Yearly Results */}
                <div className="report-section">
                  <h3>Yearly Results</h3>
                  {studentReport.allYearlyResults.map((result, index) => (
                    <div key={index} className="yearly-result">
                      <h4>Study Year {result.studyYear} ({result.resultYear})</h4>
                      <p><strong>GPA:</strong> {(result.finalGPA / 100).toFixed(2)}</p>
                      <p><strong>Status:</strong> {result.status === '1' ? 'Passed' : 'Failed'}</p>
                      <p><strong>Credits Earned:</strong> {result.totalCreditsEarned}</p>
                    </div>
                  ))}
                </div>

                {/* Graduation Record */}
                {studentReport.gradRecord.isGraduated && (
                  <div className="report-section">
                    <h3>Graduation Information</h3>
                    <p><strong>Graduation GPA:</strong> {(studentReport.gradRecord.graduationGPA / 100).toFixed(2)}</p>
                    <p><strong>Decision Number:</strong> {studentReport.gradRecord.decisionNumber}</p>
                    <p><strong>Decision Date:</strong> {studentReport.gradRecord.decisionDate}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;