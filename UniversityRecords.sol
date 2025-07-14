// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UniversityRecords {

    // ================= Enums =================

    enum CourseType { ACADEMIC, PROJECT, RESEARCH }
    enum YearlyStatus { PENDING, PASSED, FAILED }

    // ================= Structs =================

    struct Course {
        string courseCode;
        string nameEn;
        string nameAr;
        CourseType courseType;
        bool isCreated; // To check if a course exists
    }

    struct Plan {
        uint planId;
        string courseCode;
        string academicYear;
        uint theoreticalHours;
        uint practicalHours;
        uint totalHours;
        uint credits;
        uint oralWeight;
        uint writtenWeight;
        uint finalExamWeight;
        bool isCreated; // To check if a plan exists
    }

    struct Student {
        uint studentId;
        string fullName;
        uint enrollmentYear;
        bool isCreated; // To check if a student exists
    }

    struct StudentCourseMarks {
        uint oralMark;
        uint writtenMark;
        uint finalMark;
        uint totalGrade;
        // The 'verified' field has been removed.
        bool isPassed;
    }

    struct StudentYearlyResult {
        string academicYear;
        uint totalCreditsEarned;
        uint totalCreditsUnEarned;
        uint finalGPA;
        YearlyStatus status;
    }
    // ================= Mappings (State Variables) =================

    address public owner;

    // Counters to generate Unique IDs
    uint public nextStudentId = 1;
    uint public nextPlanId = 1;

    // Main data tables
    mapping(uint => Student) public students;
    mapping(string => Course) public courses;
    mapping(uint => Plan) public plans;

    // Mapping to link student marks to a study plan
    // studentId -> planId -> Marks
    mapping(uint => mapping(uint => StudentCourseMarks)) public studentMarks;

    // Mapping to link student yearly results
    // studentId -> academicYear -> Result
    mapping(uint => mapping(string => StudentYearlyResult)) public yearlyResults;

    // ================= Events =================
    event StudentAdded(uint indexed studentId, string fullName);
    event CourseAdded(string indexed courseCode, string nameEn);
    event PlanAdded(uint indexed planId, string indexed courseCode, string academicYear);
    event MarksSet(uint indexed studentId, uint indexed planId, uint totalGrade);
    event YearlyResultCalculated(uint indexed studentId, string indexed academicYear, uint finalGPA, YearlyStatus status);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ================= Modifiers =================
    modifier courseExists(string memory _courseCode) {
        require(courses[_courseCode].isCreated, "Course does not exist.");
        _;
    }

    modifier studentExists(uint _studentId) {
        require(students[_studentId].isCreated, "Student does not exist.");
        _;
    }

    modifier planExists(uint _planId) {
        require(plans[_planId].isCreated, "Plan does not exist.");
        _;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

// ================= Constructor ==================

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), owner);
    }

    // ================= Functions =================

    /**
     * @dev Adds a new course to the system.
     * @param _courseCode The official code of the course (e.g., "CS101").
     * @param _nameEn The name of the course in English.
     * @param _nameAr The name of the course in Arabic.
     * @param _courseType The type of the course (ACADEMIC, PROJECT, RESEARCH).
     */
    function addCourse(
        string memory _courseCode,
        string memory _nameEn,
        string memory _nameAr,
        CourseType _courseType
    ) public onlyOwner {
        require(!courses[_courseCode].isCreated, "Course with this code already exists.");

        courses[_courseCode] = Course({
            courseCode: _courseCode,
            nameEn: _nameEn,
            nameAr: _nameAr,
            courseType: _courseType,
            isCreated: true
        });

        emit CourseAdded(_courseCode, _nameEn);
    }

    /**
     * @dev Adds a new student to the system.
     * @param _studentId The official university ID for the student.
     * @param _fullName The full name of the student.
     * @param _enrollmentYear The year the student enrolled.
     */
    function addStudent(
        uint _studentId,
        string memory _fullName,
        uint _enrollmentYear
    ) public onlyOwner {
        require(!students[_studentId].isCreated, "Student with this ID already exists.");

        students[_studentId] = Student({
            studentId: _studentId,
            fullName: _fullName,
            enrollmentYear: _enrollmentYear,
            isCreated: true
        });

        emit StudentAdded(_studentId, _fullName);
    }

    /**
     * @dev Adds a new study plan for a course in a specific year.
     * @param _courseCode The code of the course this plan belongs to.
     * @param _academicYear The academic year for this plan (e.g., "2024-2025").
     * @param _credits The learning credits for the course in this plan.
     * @param _weights Array of weights [oral, written, finalExam].
     * @param _hours Array of hours [theoretical, practical, total].
     */
    function addPlan(
        string memory _courseCode,
        string memory _academicYear,
        uint _credits,
        uint[3] memory _weights, // [oral, written, final]
        uint[3] memory _hours    // [theoretical, practical, total]
    ) public onlyOwner courseExists(_courseCode) {
        require(_weights[0] + _weights[1] + _weights[2] == 100 || 
                _weights[0] + _weights[1] + _weights[2] == 0, 
                "Weights must sum to 100 for academic courses or 0 for projects.");

        uint planId = nextPlanId;
        nextPlanId++;

        plans[planId] = Plan({
            planId: planId,
            courseCode: _courseCode,
            academicYear: _academicYear,
            theoreticalHours: _hours[0],
            practicalHours: _hours[1],
            totalHours: _hours[2],
            credits: _credits,
            oralWeight: _weights[0],
            writtenWeight: _weights[1],
            finalExamWeight: _weights[2],
            isCreated: true
        });

        emit PlanAdded(planId, _courseCode, _academicYear);
    }
    /**
     * @dev Sets the marks for a student in an ACADEMIC course.
     * Calculates totalGrade based on weights in the plan.
     * @param _studentId The ID of the student.
     * @param _planId The ID of the study plan.
     * @param _oralMark The oral mark.
     * @param _writtenMark The written/midterm mark.
     * @param _finalMark The final exam mark.
     */
    function setAcademicMarks(
        uint _studentId,
        uint _planId,
        uint _oralMark,
        uint _writtenMark,
        uint _finalMark
    ) public onlyOwner studentExists(_studentId) planExists(_planId) {
        // --- Retrieve necessary data ---
        Plan storage plan = plans[_planId];
        Course storage course = courses[plan.courseCode];

        // --- Verification and Checks ---
        require(course.courseType == CourseType.ACADEMIC, "This function is for academic courses only.");
        require(_oralMark <= 100 && _writtenMark <= 100 && _finalMark <= 100, "Marks cannot exceed 100.");

        // --- Calculate the final grade ---
        uint totalGrade = ((_oralMark * plan.oralWeight) + 
                             (_writtenMark * plan.writtenWeight) + 
                             (_finalMark * plan.finalExamWeight)) / 100;
        
        require(totalGrade <= 100, "Calculated grade exceeds 100.");

        // --- Store the marks ---
        studentMarks[_studentId][_planId] = StudentCourseMarks({
            oralMark: _oralMark,
            writtenMark: _writtenMark,
            finalMark: _finalMark,
            totalGrade: totalGrade,
            isPassed: false // To be determined when calculating the yearly result.
        });

        // --- Emit event ---
        emit MarksSet(_studentId, _planId, totalGrade);
    }

    /**
     * @dev Sets the final grade for a student in a PROJECT or RESEARCH course.
     * @param _studentId The ID of the student.
     * @param _planId The ID of the study plan.
     * @param _totalGrade The final grade for the project/research.
     */
    function setProjectOrResearchGrade(
        uint _studentId,
        uint _planId,
        uint _totalGrade
    ) public onlyOwner studentExists(_studentId) planExists(_planId) {
        // --- Retrieve necessary data ---
        Plan storage plan = plans[_planId];
        Course storage course = courses[plan.courseCode];

        // --- Verification and Checks ---
        require(
            course.courseType == CourseType.PROJECT || course.courseType == CourseType.RESEARCH,
            "This function is for projects or research courses only."
        );
        require(
            plan.oralWeight == 0 && plan.writtenWeight == 0 && plan.finalExamWeight == 0,
            "Plan weights must be zero for this course type."
        );
        require(_totalGrade <= 100, "Grade cannot exceed 100.");

        // --- Store the marks ---
        studentMarks[_studentId][_planId] = StudentCourseMarks({
            oralMark: 0,
            writtenMark: 0,
            finalMark: 0,
            totalGrade: _totalGrade,
            isPassed: false // To be determined later
        });

        // --- Emit event ---
        emit MarksSet(_studentId, _planId, _totalGrade);
    }
       
    /**
    * @dev Calculates the final yearly result for a student based on all their course marks for a year.
    * This is a complex, multi-step function.
    * @param _studentId The ID of the student.
    * @param _academicYear The academic year to calculate for.
    * @param _planIds An array of all plan IDs the student was enrolled in for that year.
    */
    function calculateYearlyResult(
    uint _studentId,
    string memory _academicYear,
    uint[] memory _planIds
    ) public onlyOwner studentExists(_studentId) {
    uint totalWeightedGradePoints = 0;
    uint totalPossibleCredits = 0;

    // --- Step 1: Calculate the provisional GPA ---
    // We need to loop once to get the GPA, which is a dependency for passing rules.
    for (uint i = 0; i < _planIds.length; i++) {
        uint planId = _planIds[i];
        require(plans[planId].isCreated, "One of the plan IDs does not exist.");
        
        StudentCourseMarks storage marks = studentMarks[_studentId][planId];
        uint credits = plans[planId].credits;

        totalWeightedGradePoints += marks.totalGrade * credits;
        totalPossibleCredits += credits;
    }

    uint finalGPA = 0;
    if (totalPossibleCredits > 0) {
        finalGPA = (totalWeightedGradePoints * 100) / totalPossibleCredits;
    }

    // --- Step 2: Determine which courses are passed based on GPA ---
    uint totalCreditsEarned = 0;
    uint totalCreditsUnEarned = 0;

    for (uint i = 0; i < _planIds.length; i++) {
        uint planId = _planIds[i];
        StudentCourseMarks storage marks = studentMarks[_studentId][planId];
        uint credits = plans[planId].credits;
        bool courseIsPassed = false;

        // Apply the complex passing rules we agreed on
        if (finalGPA >= 6000) { // GPA is 60.00 or more
            if (marks.totalGrade >= 50) {
                courseIsPassed = true;
            }
        } else { // GPA is less than 60.00
            if (marks.totalGrade >= 60) {
                courseIsPassed = true;
            }
        }
        
        marks.isPassed = courseIsPassed;

        if (courseIsPassed) {
            totalCreditsEarned += credits;
        } else {
            totalCreditsUnEarned += credits;
        }
    }

    // --- Step 3: Determine the final yearly status ---
    YearlyStatus finalStatus = YearlyStatus.FAILED; // Default to FAILED
    if (finalGPA >= 6000 && totalCreditsUnEarned <= 15) {
        finalStatus = YearlyStatus.PASSED;
    }

    // --- Step 4: Store the final yearly result ---
    yearlyResults[_studentId][_academicYear] = StudentYearlyResult({
        academicYear: _academicYear,
        totalCreditsEarned: totalCreditsEarned,
        totalCreditsUnEarned: totalCreditsUnEarned,
        finalGPA: finalGPA,
        status: finalStatus
    });

    emit YearlyResultCalculated(_studentId, _academicYear, finalGPA, finalStatus);
    }
    
    // ================== Getter Functions ==================

    /**
     * @dev Gets the details of a specific student.
     * @param _studentId The ID of the student to look up.
     * @return A Student struct containing the student's data.
     */
    function getStudentDetails(uint _studentId) 
        public 
        view 
        studentExists(_studentId) 
        returns (Student memory) 
    {
        return students[_studentId];
    }

    /**
     * @dev Gets the marks of a student for a specific course plan.
     * @param _studentId The ID of the student.
     * @param _planId The ID of the plan.
     * @return A StudentCourseMarks struct with the marks data.
     */
    function getStudentMarksForPlan(uint _studentId, uint _planId)
        public
        view
        studentExists(_studentId)
        planExists(_planId)
        returns (StudentCourseMarks memory)
    {
        return studentMarks[_studentId][_planId];
    }

    /**
     * @dev Gets the yearly result for a student for a specific year.
     * @param _studentId The ID of the student.
     * @param _academicYear The academic year to look up.
     * @return A StudentYearlyResult struct with the result data.
     */
    function getYearlyResult(uint _studentId, string memory _academicYear)
        public
        view
        studentExists(_studentId)
        returns (StudentYearlyResult memory)
    {
        return yearlyResults[_studentId][_academicYear];
    }


}
