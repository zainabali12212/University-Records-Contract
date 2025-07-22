import { useState } from 'react';

// This component receives contract and account from its parent (AdminPanel)
function AddStudentForm({ contract, account }){
    // State variables to hold the form data

    // --- State for Add Student Form ---
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [enrollmentYear, setEnrollmentYear] = useState('');

  // Function to handle form submission

    // --- Handler for Add Student ---
  const handleAddStudent = async (event) => {
    event.preventDefault();
    if (!contract) return alert("Contract is not loaded.");
    try {
      await contract.methods.addStudent(studentId, fullName, enrollmentYear).send({ from: account });
      alert("Student added successfully!");
      setStudentId('');
      setFullName('');
      setEnrollmentYear('');
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

    return (
    <div>
      {/* --- Add Student Form --- */}
      <h3>Add New Student</h3>
      <form onSubmit={handleAddStudent}>
        <input 
          type="number" 
          placeholder="Student ID" 
          value={studentId} 
          onChange={(e) => setStudentId(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Full Name" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          placeholder="Enrollment Year" 
          value={enrollmentYear} 
          onChange={(e) => setEnrollmentYear(e.target.value)} 
          required 
        />
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
}

export default AddStudentForm;