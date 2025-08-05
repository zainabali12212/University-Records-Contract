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
  // State for the verification form
  const [verifyStudentId, setVerifyStudentId] = useState('');
  const [verifyStudyYear, setVerifyStudyYear] = useState('');
  const [verifyProvidedGPA, setVerifyProvidedGPA] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  // State for the new course grade verification form
const [verifyCgStudentId, setVerifyCgStudentId] = useState('');
const [verifyCgCourseCode, setVerifyCgCourseCode] = useState('');
const [verifyCgProvidedGrade, setVerifyCgProvidedGrade] = useState('');
const [cgVerificationResult, setCgVerificationResult] = useState('');

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

  // The comprehensive search function
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

  // Function to handle the GPA verification
  const handleGpaVerification = async (event) => {
    event.preventDefault();
    if (!contract) return;

    // Create a unique key for this specific verification attempt
    const verificationKey = `gpa_attempts_${verifyStudentId}_${verifyStudyYear}`;
    
    // --- NEW LOGIC: Check attempts before calling the contract ---
    const attempts = Number(localStorage.getItem(verificationKey)) || 0;
    if (attempts >= 3) {
      setVerificationResult('You have exceeded the maximum number of attempts for this verification.');
      return;
    }

    setVerificationResult('Verifying...');
    try {
      // Get the stored result from the smart contract
      const storedResult = await contract.methods.getYearlyResult(verifyStudentId, verifyStudyYear).call();

      // Check if a result was found
      if (storedResult.resultYear && storedResult.resultYear.length > 0) {
        // Compare the stored GPA with the provided GPA
        const storedGPA = Number(storedResult.finalGPA);
        const providedGPA = Number(verifyProvidedGPA) * 100;

        if (storedGPA === providedGPA) {
          setVerificationResult('Result is CORRECT');
          // Reset attempts on correct guess
          localStorage.setItem(verificationKey, '0');
        } else {
          setVerificationResult('Result is INCORRECT');
          // --- NEW LOGIC: Increment attempts on incorrect guess ---
          localStorage.setItem(verificationKey, attempts + 1);
        }
      } else {
        setVerificationResult('No result found for this student and study year.');
      }
    } catch (error) {
      console.error("Error during verification:", error);
      setVerificationResult('An error occurred during verification.');
    }
  };

  // Function to handle the course grade verification
  const handleCourseGradeVerification = async (event) => {
    event.preventDefault();
    if (!contract) return;

    // Create a unique key for this specific verification attempt
    const verificationKey = `grade_attempts_${verifyCgStudentId}_${verifyCgCourseCode}`;
    
    // --- NEW LOGIC: Check attempts before calling the contract ---
    const attempts = Number(localStorage.getItem(verificationKey)) || 0;
    if (attempts >= 3) {
        setCgVerificationResult('You have exceeded the maximum number of attempts for this verification.');
        return;
    }

    setCgVerificationResult('Verifying...');
    try {
        // Call the getter function from the smart contract
        const storedGrade = await contract.methods.getCertifiedGrade(verifyCgStudentId, verifyCgCourseCode).call();

        if (storedGrade > 0) {
            if (storedGrade == verifyCgProvidedGrade) {
                setCgVerificationResult('Grade is CORRECT');
                // Reset attempts on correct guess
                localStorage.setItem(verificationKey, '0');
            } else {
                setCgVerificationResult('Grade is INCORRECT');
                // --- NEW LOGIC: Increment attempts on incorrect guess ---
                localStorage.setItem(verificationKey, attempts + 1);
            }
        } else {
            setCgVerificationResult('No certified grade found for this course.');
        }
    } catch (error) {
        console.error("Error during course grade verification:", error);
        setCgVerificationResult('An error occurred.');
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

            {/* Search Form */}
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

                {/* Yearly Results Table */}
                <div className="report-section">
                  <h3>Yearly Results</h3>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Study Year</th>
                        <th>Academic Year</th>
                        <th>GPA</th>
                        <th>Status</th>
                        <th>Credits Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentReport.allYearlyResults.map((result, index) => (
                        <tr key={index}>
                          <td>{result.studyYear}</td>
                          <td>{result.resultYear}</td>
                          <td>{(result.finalGPA / 100).toFixed(2)}</td>
                          <td>{result.status === '1' ? 'Passed' : 'Failed'}</td>
                          <td>{result.totalCreditsEarned}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

      <hr />
            
            {/* GPA Verification Form */}
            <form onSubmit={handleGpaVerification}>
              <h3>Verify a Student's Yearly GPA</h3>
              <input 
                type="number"
                placeholder="Enter Student ID"
                value={verifyStudentId}
                onChange={(e) => setVerifyStudentId(e.target.value)}
                required
              />
              <input 
                type="number"
                placeholder="Study Year (1-5)"
                value={verifyStudyYear}
                onChange={(e) => setVerifyStudyYear(e.target.value)}
                required
              />
              <input 
                type="number"
                step="0.01" // Allows decimal input
                placeholder="GPA to Verify (e.g., 92.66)"
                value={verifyProvidedGPA}
                onChange={(e) => setVerifyProvidedGPA(e.target.value)}
                required
              />
              <button type="submit">Verify GPA</button>
            </form>

            {/* Display the verification result */}
            {verificationResult && <p><strong>Verification Status:</strong> {verificationResult}</p>}

            <hr />

            {/* Course Grade Verification Form */}
          <form onSubmit={handleCourseGradeVerification}>
          <h3>Verify a Student's Course Grade</h3>
          <input 
            type="number"
            placeholder="Enter Student ID"
            value={verifyCgStudentId}
            onChange={(e) => setVerifyCgStudentId(e.target.value)}
            required
          />
          <input 
            type="text"
            placeholder="Course Code (e.g., CS101)"
            value={verifyCgCourseCode}
            onChange={(e) => setVerifyCgCourseCode(e.target.value)}
            required
          />
          <input 
            type="number"
            placeholder="Grade to Verify"
            value={verifyCgProvidedGrade}
            onChange={(e) => setVerifyCgProvidedGrade(e.target.value)}
            required
          />
          <button type="submit">Verify Grade</button>
          </form>
        {/* Display the verification result */}
          {cgVerificationResult && <p><strong>Verification Status:</strong> {cgVerificationResult}</p>}

            
    </div>

    
  );
}

export default App;