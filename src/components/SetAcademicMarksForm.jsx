import { useState } from 'react';

// This component receives contract and account from its parent (AdminPanel)
function SetAcademicMarksForm({ contract, account }) {
    // State variables to hold the form data

   // --- State for Add AcademicMarks Form ---
  const [studentId, setStudentId] = useState('');
  const [planId, setPlanId] = useState('');
  const [oralMark, setOralMark] = useState('');
  const [writtenMark, setWrittenMark] = useState('');
  const [finalMark, setFinalMark] = useState('');

    // Function to handle form submission

   // --- Handler for Add AcademicMarks ---
  const handleSetMarks = async (event) => {
    event.preventDefault();
    if (!contract) return alert("Contract is not loaded.");
    try {
      await contract.methods.setAcademicMarks(studentId, planId, oralMark, writtenMark, finalMark).send({ from: account });
      alert("Academic marks set successfully!");
      // Clear the form
      setStudentId('');
      setPlanId('');
      setOralMark('');
      setWrittenMark('');
      setFinalMark('');
    } catch (error) {
      console.error("Error setting academic marks:", error);
      alert("Failed to set academic marks.");
    }
  };

  return (
    <div>
      {/* --- Add AcademicMarks Form --- */}
      <h3>Set Academic Marks</h3>
      <form onSubmit={handleSetMarks}>
        <input type="number" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
        <input type="number" placeholder="Plan ID" value={planId} onChange={(e) => setPlanId(e.target.value)} required />
        <br />
        <input type="number" placeholder="Oral Mark" value={oralMark} onChange={(e) => setOralMark(e.target.value)} required />
        <input type="number" placeholder="Written Mark" value={writtenMark} onChange={(e) => setWrittenMark(e.target.value)} required />
        <input type="number" placeholder="Final Exam Mark" value={finalMark} onChange={(e) => setFinalMark(e.target.value)} required />
        <br />
        <button type="submit">Set Marks</button>
      </form>
    </div>
  );
}

export default SetAcademicMarksForm;