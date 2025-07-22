import { useState } from 'react';

// We receive 'contract' as a prop from App.jsx
function PublicView({ contract }) {
  const [courseCodeSearch, setCourseCodeSearch] = useState('');
  const [courseResult, setCourseResult] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');

  // --- State for Student Search ---
  const [studentIdSearch, setStudentIdSearch] = useState('');
  const [studentResult, setStudentResult] = useState(null);
  const [studentSearchMessage, setStudentSearchMessage] = useState('');

  // --- State for Plan Search ---
  const [planIdSearch, setPlanIdSearch] = useState('');
  const [planResult, setPlanResult] = useState(null);
  const [planSearchMessage, setPlanSearchMessage] = useState('');

  // --- State for Marks Search ---
  const [marksStudentId, setMarksStudentId] = useState('');
  const [marksPlanId, setMarksPlanId] = useState('');
  const [marksResult, setMarksResult] = useState(null);
  const [marksSearchMessage, setMarksSearchMessage] = useState('');

  const handleCourseSearch = async (event) => {
    event.preventDefault();
    if (!contract) return;
    setCourseResult(null); // Clear previous result
    try {
      // Call the public getter function for the 'courses' mapping
      const result = await contract.methods.courses(courseCodeSearch).call();
      
      // The getter returns default values if not found, so we check 'isCreated'
      if (result.isCreated) {
        setCourseResult(result);
        setSearchMessage('');
      } else {
        setSearchMessage('Course not found.');
      }
    } catch (error) {
      console.error("Error searching for course:", error);
      setSearchMessage('Error searching for course.');
    }
  };

  const handleStudentSearch = async (event) => {
    event.preventDefault();
    if (!contract) return;
    setStudentResult(null); // Clear previous result
    setStudentSearchMessage('');
    try {
      // Call the getStudentDetails function from the smart contract
      const result = await contract.methods.getStudentDetails(studentIdSearch).call();
      
      if (result.isCreated) {
        setStudentResult(result);
      } else {
        setStudentSearchMessage('Student not found.');
      }
    } catch (error) {
      console.error("Error searching for student:", error);
      setStudentSearchMessage('Error searching for student.');
    }
  };

  const handlePlanSearch = async (event) => {
    event.preventDefault();
    if (!contract) return;
    setPlanResult(null); // Clear previous result
    setPlanSearchMessage('');
    try {
      // Call the public getter function for the 'plans' mapping
      const result = await contract.methods.plans(planIdSearch).call();
      
      if (result.isCreated) {
        setPlanResult(result);
      } else {
        setPlanSearchMessage('Plan not found.');
      }
    } catch (error) {
      console.error("Error searching for plan:", error);
      setPlanSearchMessage('Error searching for plan.');
    }
  };

  const handleMarksSearch = async (event) => {
    event.preventDefault();
    if (!contract) return;
    setMarksResult(null); // Clear previous result
    setMarksSearchMessage('');
    try {
      // Call the getStudentMarksForPlan function from the smart contract
      const result = await contract.methods.getStudentMarksForPlan(marksStudentId, marksPlanId).call();
      
      // We check totalGrade because a new/empty record would have 0 for all marks
      if (result.totalGrade > 0 || (result.oralMark > 0 || result.writtenMark > 0 || result.finalMark > 0)) {
        setMarksResult(result);
      } else {
        setMarksSearchMessage('Marks not found for this student and plan.');
      }
    } catch (error) {
      console.error("Error searching for marks:", error);
      setMarksSearchMessage('Error searching for marks.');
    }
  };

  return (
    <div className="public-view">
      <h2>Public Data Viewer</h2>
      <hr />

      {/* --- Search Course Form --- */}
      <h3>Search for a Course</h3>
      <form onSubmit={handleCourseSearch}>
        <input 
          type="text" 
          placeholder="Enter Course Code" 
          value={courseCodeSearch}
          onChange={(e) => setCourseCodeSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* --- Display Search Result --- */}
      {searchMessage && <p>{searchMessage}</p>}
      {courseResult && (
        <div>
          <h4>Course Details</h4>
          <p><strong>Code:</strong> {courseResult.courseCode}</p>
          <p><strong>Name (EN):</strong> {courseResult.nameEn}</p>
          <p><strong>Name (AR):</strong> {courseResult.nameAr}</p>
        </div>
      )}

      <hr />

      {/* --- Search Student Form --- */}
      <h3>Search for a Student</h3>
      <form onSubmit={handleStudentSearch}>
        <input 
          type="number" 
          placeholder="Enter Student ID" 
          value={studentIdSearch}
          onChange={(e) => setStudentIdSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* --- Display Student Search Result --- */}
      {studentSearchMessage && <p>{studentSearchMessage}</p>}
      {studentResult && (
        <div>
          <h4>Student Details</h4>
          <p><strong>ID:</strong> {studentResult.studentId}</p>
          <p><strong>Full Name:</strong> {studentResult.fullName}</p>
          <p><strong>Enrollment Year:</strong> {studentResult.enrollmentYear}</p>
        </div>
      )}

      <hr />

      {/* --- Search Plan Form --- */}
      <h3>Search for a Study Plan</h3>
      <form onSubmit={handlePlanSearch}>
        <input 
          type="number" 
          placeholder="Enter Plan ID" 
          value={planIdSearch}
          onChange={(e) => setPlanIdSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* --- Display Plan Search Result --- */}
      {planSearchMessage && <p>{planSearchMessage}</p>}
      {planResult && (
        <div>
          <h4>Plan Details</h4>
          <p><strong>Plan ID:</strong> {planResult.planId}</p>
          <p><strong>Course Code:</strong> {planResult.courseCode}</p>
          <p><strong>Academic Year:</strong> {planResult.academicYear}</p>
          <p><strong>Credits:</strong> {planResult.credits}</p>
          <p><strong>Oral Weight:</strong> {planResult.oralWeight}%</p>
          <p><strong>Written Weight:</strong> {planResult.writtenWeight}%</p>
          <p><strong>Final Exam Weight:</strong> {planResult.finalExamWeight}%</p>
        </div>
      )}

      <hr />

      {/* --- Search Marks Form --- */}
      <h3>Search for Student Marks in a Plan</h3>
      <form onSubmit={handleMarksSearch}>
        <input 
          type="number" 
          placeholder="Enter Student ID" 
          value={marksStudentId}
          onChange={(e) => setMarksStudentId(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Enter Plan ID" 
          value={marksPlanId}
          onChange={(e) => setMarksPlanId(e.target.value)}
        />
        <button type="submit">Search Marks</button>
      </form>

      {/* --- Display Marks Search Result --- */}
      {marksSearchMessage && <p>{marksSearchMessage}</p>}
      {marksResult && (
        <div>
          <h4>Marks Details</h4>
          <p><strong>Oral Mark:</strong> {marksResult.oralMark}</p>
          <p><strong>Written Mark:</strong> {marksResult.writtenMark}</p>
          <p><strong>Final Exam Mark:</strong> {marksResult.finalMark}</p>
          <p><strong>Total Grade:</strong> {marksResult.totalGrade}</p>
          <p><strong>Passed Course:</strong> {marksResult.isPassed ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}

export default PublicView;