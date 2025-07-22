import { useState } from 'react';

function SetProjectGradeForm({ contract, account }) {
  // State variables to hold the form data

  // --- State for this form ---
  const [studentId, setStudentId] = useState('');
  const [planId, setPlanId] = useState('');
  const [totalGrade, setTotalGrade] = useState('');

  // Function to handle form submission

  // --- Handler for this form ---
  const handleSetGrade = async (event) => {
    event.preventDefault();
    if (!contract) return alert("Contract is not loaded.");
    try {
      await contract.methods.setProjectOrResearchGrade(studentId, planId, totalGrade).send({ from: account });
      alert("Project/Research grade set successfully!");
      // Clear the form
      setStudentId('');
      setPlanId('');
      setTotalGrade('');
    } catch (error) {
      console.error("Error setting project grade:", error);
      alert("Failed to set project grade.");
    }
  };

  return (
    <div>
      <h3>Set Project/Research Grade</h3>
      <form onSubmit={handleSetGrade}>
        <input type="number" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
        <input type="number" placeholder="Plan ID" value={planId} onChange={(e) => setPlanId(e.target.value)} required />
        <input type="number" placeholder="Final Grade" value={totalGrade} onChange={(e) => setTotalGrade(e.target.value)} required />
        <button type="submit">Set Grade</button>
      </form>
    </div>
  );
}

export default SetProjectGradeForm;