// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UniversityRecords {

    // ================= Enums =================

    enum CourseType { ACADEMIC, PROJECT, RESEARCH }
    enum YearlyStatus { PENDING, PASSED, FAILED }
    enum CoursePassStatus { PENDING, PASSED, FAILED }

    // ================= Structs =================

    struct Course {
        string courseCode;           // The unique code for the course, e.g., "CS101"
        string nameEn;               // Course name in English
        string nameAr;               // Course name in Arabic
        CourseType courseType;       // The type of the course (ACADEMIC, PROJECT, etc.)
        bool isCreated;              // A flag to check if a course exists
    }

    struct Plan {
        uint planId;                 // Unique numerical ID for the plan
        string courseCode;           // The code of the course this plan belongs to
        string planYear;             // The version year of this plan, e.g., "2025-2026"
        uint8 studyYear;             // The curriculum year this course belongs to (1, 2, 3, etc.)
        uint theoreticalHours;       // Number of theoretical hours
        uint practicalHours;         // Number of practical hours
        uint totalHours;             // Total hours
        uint credits;                // Learning credits for the course
        uint oralWeight;             // Contribution weight of the oral mark %
        uint writtenWeight;          // Contribution weight of the written mark %
        uint finalExamWeight;        // Contribution weight of the final exam mark %
        bool isCreated;              // A flag to check if a plan exists
    }

    struct Student {
        uint studentId;              // The student's official university ID
        string fullName;             // Student's full name
        uint enrollmentYear;         // The calendar year the student first enrolled in the university
        bool isCreated;              // A flag to confirm the student exists
    }

    struct StudentCourseMarks {
        uint oralMark;                // The oral mark component
        uint writtenMark;             // The written mark component
        uint finalMark;               // The final exam mark component
        uint totalGrade;              // The final calculated grade for the course
        CoursePassStatus passStatus;  // The pass/fail/pending status for this specific course
    }

    struct StudentYearlyResult {
        string resultYear;            // The calendar year this result was recorded for, e.g., "2025-2026"
        uint8 studyYear;              // The curriculum year this student belongs to (1, 2, 3, etc.)
        uint totalCreditsEarned;      // Total credits earned from passed courses in the study year
        uint totalCreditsUnEarned;    // Total credits from failed courses in the study year
        uint finalGPA;                // The final GPA for the study year 
        YearlyStatus status;          // The final status for the year (PENDING, PASSED, FAILED)
    }

    struct GraduationRecord {
        bool isGraduated;           // A flag to indicate if the student has graduated
        uint graduationGPA;         // The final graduation GPA (value * 100)
        string decisionNumber;      // The official graduation decision number
        string decisionDate;        // The date of the graduation decision
    }
 
    // ================= Mappings (State Variables) =================

    address public owner;

    // Counters to generate Unique IDs
    uint public nextPlanId = 1;

    // Main data tables
    mapping(uint => Student) public students;
    mapping(string => Course) public courses;
    mapping(uint => Plan) public plans;

    // Mapping to link student marks to a study plan
    // studentId -> planId -> Marks
    mapping(uint => mapping(uint => StudentCourseMarks)) public studentMarks;

    // Mapping to link student yearly results
   // studentId -> studyYear -> StudentYearlyResult
    mapping(uint => mapping(uint8 => StudentYearlyResult)) public yearlyResults;

    // Lookup mapping to find a planId by course code and year
    // courseCode => planYear => planId
    mapping(string => mapping(string => uint)) public planIdLookup;

    // Mapping to store graduation records
    // studentId -> GraduationRecord
    mapping(uint => GraduationRecord) public graduationRecords;

    // studentId -> courseCode -> array of all planIds attempted
    mapping(uint => mapping(string => uint[])) public studentCourseAttempts;

    // ================= Events =================
    event StudentAdded(uint indexed studentId, string fullName);
    event CourseAdded(string indexed courseCode, string nameEn);
    event PlanAdded(uint indexed planId, string indexed courseCode, string planYear);
    event MarksSet(uint indexed studentId, uint indexed planId, uint totalGrade);
    event YearlyResultCalculated(uint indexed studentId, string indexed resultYear, uint finalGPA, YearlyStatus status);
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
     * @param _planYear The academic year for this plan (e.g., "2024-2025").
     * @param _credits The learning credits for the course in this plan.
     * @param _weights Array of weights [oral, written, finalExam].
     * @param _hours Array of hours [theoretical, practical, total].
     */
    function addPlan(
        string memory _courseCode,
        string memory _planYear,
        uint8 _studyYear,
        uint _credits,
        uint[3] memory _weights, // [oral, written, final]
        uint[3] memory _hours    // [theoretical, practical, total]
    ) public onlyOwner courseExists(_courseCode) {
        require(_weights[0] + _weights[1] + _weights[2] == 100 || 
                _weights[0] + _weights[1] + _weights[2] == 0, 
                "Weights must sum to 100 for academic courses or 0 for projects.");
                require(planIdLookup[_courseCode][_planYear] == 0,
                "Plan for this course and year already exists.");

        uint planId = nextPlanId;
        nextPlanId++;

        plans[planId] = Plan({
            planId: planId,
            courseCode: _courseCode,
            planYear: _planYear,
            studyYear: _studyYear,
            theoreticalHours: _hours[0],
            practicalHours: _hours[1],
            totalHours: _hours[2],
            credits: _credits,
            oralWeight: _weights[0],
            writtenWeight: _weights[1],
            finalExamWeight: _weights[2],
            isCreated: true
        });
        planIdLookup[_courseCode][_planYear] = planId;
        emit PlanAdded(planId, _courseCode, _planYear);
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
        uint _finalMark,
        uint _totalGrade
    ) public onlyOwner studentExists(_studentId) planExists(_planId) {
        // --- Retrieve necessary data ---
        Plan storage plan = plans[_planId];
        Course storage course = courses[plan.courseCode];

        // --- Verification and Checks ---
        require(course.courseType == CourseType.ACADEMIC, "This function is for academic courses only.");
        require(_oralMark <= 100 && _writtenMark <= 100 && _finalMark <= 100, "Marks cannot exceed 100.");

        // --- Calculate the final grade ---
        uint calculatedGrade = ((_oralMark * plan.oralWeight) + 
                         (_writtenMark * plan.writtenWeight) + 
                         (_finalMark * plan.finalExamWeight)) / 100;

       require(calculatedGrade <= 100,
        "Calculation result exceeds 100. Check input marks and weights.");

       //  verification line
    require(calculatedGrade == _totalGrade,
     "Provided total grade does not match calculation.");

        // --- Determine initial pass status based on logic ---
        CoursePassStatus initialStatus;
        if (_totalGrade >= 60) {
            initialStatus = CoursePassStatus.PASSED; // Definitely passed
        } else if (_totalGrade >= 50) {
            initialStatus = CoursePassStatus.PENDING; // Depends on the yearly GPA
        } else {
            initialStatus = CoursePassStatus.FAILED; // Definitely failed
        }

        // --- Store the marks with the calculated status ---
        studentMarks[_studentId][_planId] = StudentCourseMarks({
            oralMark: _oralMark,
            writtenMark: _writtenMark,
            finalMark: _finalMark,
            totalGrade: _totalGrade,
            passStatus: initialStatus 
        });
        studentCourseAttempts[_studentId][course.courseCode].push(_planId);

        // --- Emit event ---
        emit MarksSet(_studentId, _planId, _totalGrade);
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

        // --- Determine initial pass status ---
        CoursePassStatus initialStatus;
        if (_totalGrade >= 60) {
            initialStatus = CoursePassStatus.PASSED;
        } else if (_totalGrade >= 50) {
            initialStatus = CoursePassStatus.PENDING;
        } else {
            initialStatus = CoursePassStatus.FAILED;
        }
        
        // --- Store the marks ---
        studentMarks[_studentId][_planId] = StudentCourseMarks({
            oralMark: 0,
            writtenMark: 0,
            finalMark: 0,
            totalGrade: _totalGrade,
            passStatus: initialStatus 
        });
        studentCourseAttempts[_studentId][course.courseCode].push(_planId);

        // --- Emit event ---
        emit MarksSet(_studentId, _planId, _totalGrade);
    }
 
    /**
     * @dev Calculates a yearly result and verifies it against a provided GPA.
     */
    function calculateAndVerifyGPA(
        uint _studentId,
        string memory _resultYear,
        uint8 _studyYear,
        uint _providedGPA ,  // The only value we receive for verification
        uint[] memory _planIds
    ) public onlyOwner studentExists(_studentId) {
        
        uint totalWeightedGradePoints = 0;
        uint totalPossibleCredits = 0;

        // --- Step 1: Calculate GPA components from the list of courses ---
        for (uint i = 0; i < _planIds.length; i++) {
            uint planId = _planIds[i];
            require(plans[planId].isCreated, "One of the plan IDs does not exist.");
            
            StudentCourseMarks storage marks = studentMarks[_studentId][planId];
            uint credits = plans[planId].credits;

            totalWeightedGradePoints += marks.totalGrade * credits;
            totalPossibleCredits += credits;
        }

        // --- Step 2: Calculate final GPA ---
        uint finalGPA = 0;
        if (totalPossibleCredits > 0) {
            finalGPA = (totalWeightedGradePoints * 100) / totalPossibleCredits;
        }

        // --- Verification Step ---
        require(finalGPA == _providedGPA, "Provided GPA does not match calculation.");

        uint totalCreditsEarned = 0;
        uint totalCreditsUnEarned = 0;

        for (uint i = 0; i < _planIds.length; i++) {
            uint planId = _planIds[i];
            StudentCourseMarks storage marks = studentMarks[_studentId][planId];
            uint credits = plans[planId].credits;
            CoursePassStatus currentStatus = CoursePassStatus.FAILED;

            if (finalGPA >= 6000) {
                if (marks.totalGrade >= 50) { currentStatus = CoursePassStatus.PASSED; }
            } else {
                if (marks.totalGrade >= 60) { currentStatus = CoursePassStatus.PASSED; }
            }
            
            marks.passStatus = currentStatus;

            if (currentStatus == CoursePassStatus.PASSED) {
                totalCreditsEarned += credits;
            } else {
                totalCreditsUnEarned += credits;
            }
        }

        YearlyStatus finalStatus = YearlyStatus.FAILED;
        if (finalGPA >= 6000 && totalCreditsUnEarned <= 15) {
            finalStatus = YearlyStatus.PASSED;
        }

        yearlyResults[_studentId][_studyYear] = StudentYearlyResult({
            resultYear: _resultYear,
            studyYear: _studyYear,
            totalCreditsEarned: totalCreditsEarned,
            totalCreditsUnEarned: totalCreditsUnEarned,
            finalGPA: _providedGPA ,
            status: finalStatus
        });

        emit YearlyResultCalculated(_studentId, _resultYear, _providedGPA, finalStatus);
    }

    /**
     * @dev Sets the graduation record for a student.
     */
    function setGraduationRecord(
        uint _studentId,
        uint _graduationGPA,
        string memory _decisionNumber,
        string memory _decisionDate
    ) public onlyOwner studentExists(_studentId) {
        graduationRecords[_studentId] = GraduationRecord({
            isGraduated: true,
            graduationGPA: _graduationGPA,
            decisionNumber: _decisionNumber,
            decisionDate: _decisionDate
        });
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
     * @param _studyYear The study year to look up.
     * @return A StudentYearlyResult struct with the result data.
     */
    function getYearlyResult(uint _studentId, uint8 _studyYear)
        public
        view
        studentExists(_studentId)
        returns (StudentYearlyResult memory)
    {
        return yearlyResults[_studentId][_studyYear];
    }
    
    /**
     * @dev Gets a full comprehensive report for a student by their ID.
     */
    function getStudentFullReport(uint _studentId)
        public
        view
        studentExists(_studentId)
        returns (
            Student memory studentDetails,
            StudentYearlyResult[] memory allYearlyResults,
            GraduationRecord memory gradRecord
        )
    {
        studentDetails = students[_studentId];
        gradRecord = graduationRecords[_studentId];
        
        StudentYearlyResult[] memory results = new StudentYearlyResult[](5);
        uint resultCount = 0;

        // Loop through study years 1 to 5 and fetch results directly
        for (uint8 studyYear = 1; studyYear <= 5; studyYear++) {
            // Check if a result exists for this study year
            if (bytes(yearlyResults[_studentId][studyYear].resultYear).length > 0) {
                results[resultCount] = yearlyResults[_studentId][studyYear];
                resultCount++;
            }
        }
        
        // Copy the found results into the final array to be returned
        allYearlyResults = new StudentYearlyResult[](resultCount);
        for (uint i = 0; i < resultCount; i++) {
            allYearlyResults[i] = results[i];
        }
    }
    
    /**
     * @dev Gets the certified (PASSED) grade for a student in a specific course.
     * @param _studentId The ID of the student.
     * @param _courseCode The code of the course to check.
     * @return The certified total grade, or 0 if no certified grade exists.
     */
    function getCertifiedGrade(uint _studentId, string memory _courseCode)
        public
        view
        studentExists(_studentId)
        returns (uint)
    {
        uint[] memory attemptPlanIds = studentCourseAttempts[_studentId][_courseCode];
        for (uint i = 0; i < attemptPlanIds.length; i++) {
            uint planId = attemptPlanIds[i];
            if (studentMarks[_studentId][planId].passStatus == CoursePassStatus.PASSED) {
                return studentMarks[_studentId][planId].totalGrade;
            }
        }
        return 0; // Return 0 if no PASSED grade is found
    }

}