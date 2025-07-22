import { useState } from 'react';

// This component receives contract and account from its parent (AdminPanel)
function AddCourseForm({ contract, account }){
    // State variables to hold the form data

  // --- State for Add Course Form ---
  const [courseCode, setCourseCode] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [courseType, setCourseType] = useState(0); // 0 for ACADEMIC, 1 for PROJECT, etc.

  // Function to handle form submission

  // --- Handler for Add Course ---
  const handleAddCourse = async (event) => {
    event.preventDefault(); // Prevents page reload on submission
    if (!contract) {
      alert("Contract is not loaded yet.");
      return;
    }
    try {
      // This is where we call the smart contract function
      await contract.methods.addCourse(courseCode, nameEn, nameAr, courseType).send({ from: account });
      alert("Course added successfully!");
      // Optionally, clear the form after submission
      setCourseCode('');
      setNameEn('');
      setNameAr('');
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course.");
    }
  };

  return (
    <div>
      <h3>Add New Course</h3>
      <form onSubmit={handleAddCourse}>
        <input 
          type="text" 
          placeholder="Course Code (e.g., CS101)" 
          value={courseCode} 
          onChange={(e) => setCourseCode(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Name (English)" 
          value={nameEn} 
          onChange={(e) => setNameEn(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Name (Arabic)" 
          value={nameAr} 
          onChange={(e) => setNameAr(e.target.value)} 
          required 
        />
        <select value={courseType} onChange={(e) => setCourseType(e.target.value)}>
          <option value="0">Academic</option>
          <option value="1">Project</option>
          <option value="2">Research</option>
        </select>
        <button type="submit">Add Course</button>
      </form>
    </div>
  );
}

export default AddCourseForm;
