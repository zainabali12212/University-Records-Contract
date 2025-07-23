import { useState } from 'react';

function CalculateYearlyResultForm({ contract, account }) {
    // State variables to hold the form data

  // --- State for this form ---
  const [studentId, setStudentId] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [planIds, setPlanIds] = useState(''); // Will be a comma-separated string

    // Function to handle form submission

  // --- Handler for this form ---
  const handleCalculateResult = async (event) => {
    event.preventDefault();
    if (!contract) return alert("Contract is not loaded.");
    
    // Convert the comma-separated string of plan IDs into an array of numbers
    const planIdsArray = planIds.split(',').map(id => Number(id.trim()));

    try {
      await contract.methods.calculateYearlyResult(studentId, academicYear, planIdsArray).send({ from: account });
      alert("Yearly result calculated successfully!");
      // Clear the form
      setStudentId('');
      setAcademicYear('');
      setPlanIds('');
    } catch (error) {
      console.error("Error calculating yearly result:", error);
      alert("Failed to calculate yearly result.");
    }
  };

  return (
    <div>
      <h3>Calculate Student's Yearly Result</h3>
      <form onSubmit={handleCalculateResult}>
        <input type="number" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
        <input type="text" placeholder="Academic Year (e.g., 2024-2025)" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} required />
        <input 
          type="text" 
          placeholder="Plan IDs (comma-separated, e.g., 1, 2, 3)" 
          value={planIds} 
          onChange={(e) => setPlanIds(e.target.value)} 
          required 
        />
        <button type="submit">Calculate Result</button>
      </form>
    </div>
  );
}

export default CalculateYearlyResultForm;