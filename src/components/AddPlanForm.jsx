import { useState } from 'react';

// This component receives contract and account from its parent (AdminPanel)
function AddPlanForm({ contract, account }){
  // State variables to hold the form data

  // --- State for Add Plan Form ---
  const [planCourseCode, setPlanCourseCode] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [credits, setCredits] = useState('');
  const [theoreticalHours, setTheoreticalHours] = useState('');
  const [practicalHours, setPracticalHours] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [oralWeight, setOralWeight] = useState('');
  const [writtenWeight, setWrittenWeight] = useState('');
  const [finalExamWeight, setFinalExamWeight] = useState('');

    // Function to handle form submission

    // --- Handler for Add Plan ---
  const handleAddPlan = async (event) => {
    event.preventDefault();
    if (!contract) return alert("Contract is not loaded.");
    
    // Group weights and hours into arrays
    const weights = [oralWeight, writtenWeight, finalExamWeight];
    const hours = [theoreticalHours, practicalHours, totalHours];

    try {
      await contract.methods.addPlan(planCourseCode, academicYear, credits, weights, hours).send({ from: account });
      alert("Plan added successfully!");
      // Optionally clear the form
      setPlanCourseCode('');
      setAcademicYear('');
      setCredits('');
      setTheoreticalHours('');
      setPracticalHours('');
      setTotalHours('');
      setOralWeight('');
      setWrittenWeight('');
      setFinalExamWeight('');
    } catch (error) {
      console.error("Error adding plan:", error);
      alert("Failed to add plan.");
    }
  };

  return(
    <div>
         {/* --- Add Plan Form --- */}
      <h3>Add New Study Plan</h3>
      <form onSubmit={handleAddPlan}>
        <input type="text" placeholder="Course Code" value={planCourseCode} onChange={(e) => setPlanCourseCode(e.target.value)} required />
        <input type="text" placeholder="Academic Year (e.g., 2024-2025)" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} required />
        <input type="number" placeholder="Credits" value={credits} onChange={(e) => setCredits(e.target.value)} required />
        <br />
        <input type="number" placeholder="Theoretical Hours" value={theoreticalHours} onChange={(e) => setTheoreticalHours(e.target.value)} required />
        <input type="number" placeholder="Practical Hours" value={practicalHours} onChange={(e) => setPracticalHours(e.target.value)} required />
        <input type="number" placeholder="Total Hours" value={totalHours} onChange={(e) => setTotalHours(e.target.value)} required />
        <br />
        <input type="number" placeholder="Oral Weight %" value={oralWeight} onChange={(e) => setOralWeight(e.target.value)} required />
        <input type="number" placeholder="Written Weight %" value={writtenWeight} onChange={(e) => setWrittenWeight(e.target.value)} required />
        <input type="number" placeholder="Final Exam Weight %" value={finalExamWeight} onChange={(e) => setFinalExamWeight(e.target.value)} required />
        <br />
        <button type="submit">Add Plan</button>
      </form>
    </div>
  );
}

export default AddPlanForm;
