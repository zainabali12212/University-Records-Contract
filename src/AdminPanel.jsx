// Import the smaller form components
import AddCourseForm from './components/AddCourseForm';
import AddStudentForm from './components/AddStudentForm'; 
import AddPlanForm from './components/AddPlanForm'; 
import SetAcademicMarksForm from './components/SetAcademicMarksForm';
import SetProjectGradeForm from './components/SetProjectGradeForm';
import CalculateYearlyResultForm from './components/CalculateYearlyResultForm';

// It receives contract and account to pass them down to the children
function AdminPanel({ contract, account }) {
  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      <hr />
      {<AddCourseForm contract={contract} account={account} />}
      
      <hr />
      { <AddStudentForm contract={contract} account={account} /> }
      
      <hr />
      { <AddPlanForm contract={contract} account={account} /> }

      <hr />
      {<SetAcademicMarksForm contract={contract} account={account} />}

      <hr />
      {<SetProjectGradeForm contract={contract} account={account} />}

      <hr />
      {<CalculateYearlyResultForm contract={contract} account={account} />}

    </div>
  );
}

export default AdminPanel;