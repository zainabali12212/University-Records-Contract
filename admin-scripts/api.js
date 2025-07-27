// 1. Setup Connection
const Web3 = require('web3');
const ganacheUrl = 'http://127.0.0.1:8545'; // Make sure this is your ganache-cli URL
const web3 = new Web3(ganacheUrl);

// 2. Contract Details
// IMPORTANT: Copy the final ABI and Address here
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_courseCode",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_nameEn",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_nameAr",
				"type": "string"
			},
			{
				"internalType": "enum UniversityRecords.CourseType",
				"name": "_courseType",
				"type": "uint8"
			}
		],
		"name": "addCourse",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_courseCode",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_planYear",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "_studyYear",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_credits",
				"type": "uint256"
			},
			{
				"internalType": "uint256[3]",
				"name": "_weights",
				"type": "uint256[3]"
			},
			{
				"internalType": "uint256[3]",
				"name": "_hours",
				"type": "uint256[3]"
			}
		],
		"name": "addPlan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_studentId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_fullName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_enrollmentYear",
				"type": "uint256"
			}
		],
		"name": "addStudent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_studentId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_resultYear",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "_studyYear",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_providedGPA",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "_planIds",
				"type": "uint256[]"
			}
		],
		"name": "calculateAndVerifyGPA",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "courseCode",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "nameEn",
				"type": "string"
			}
		],
		"name": "CourseAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "studentId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "planId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalGrade",
				"type": "uint256"
			}
		],
		"name": "MarksSet",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "planId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "courseCode",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "planYear",
				"type": "string"
			}
		],
		"name": "PlanAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_studentId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_planId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_oralMark",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_writtenMark",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_finalMark",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_totalGrade",
				"type": "uint256"
			}
		],
		"name": "setAcademicMarks",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_studentId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_graduationGPA",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_decisionNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_decisionDate",
				"type": "string"
			}
		],
		"name": "setGraduationRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_studentId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_planId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_totalGrade",
				"type": "uint256"
			}
		],
		"name": "setProjectOrResearchGrade",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "studentId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "fullName",
				"type": "string"
			}
		],
		"name": "StudentAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "studentId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "resultYear",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "finalGPA",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum UniversityRecords.YearlyStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"name": "YearlyResultCalculated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "courses",
		"outputs": [
			{
				"internalType": "string",
				"name": "courseCode",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "nameEn",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "nameAr",
				"type": "string"
			},
			{
				"internalType": "enum UniversityRecords.CourseType",
				"name": "courseType",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "isCreated",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_studentId",
				"type": "uint256"
			}
		],
		"name": "getStudentDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "studentId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "fullName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "enrollmentYear",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCreated",
						"type": "bool"
					}
				],
				"internalType": "struct UniversityRecords.Student",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_studentId",
				"type": "uint256"
			}
		],
		"name": "getStudentFullReport",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "studentId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "fullName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "enrollmentYear",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCreated",
						"type": "bool"
					}
				],
				"internalType": "struct UniversityRecords.Student",
				"name": "studentDetails",
				"type": "tuple"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "resultYear",
						"type": "string"
					},
					{
						"internalType": "uint8",
						"name": "studyYear",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "totalCreditsEarned",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalCreditsUnEarned",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "finalGPA",
						"type": "uint256"
					},
					{
						"internalType": "enum UniversityRecords.YearlyStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct UniversityRecords.StudentYearlyResult[]",
				"name": "allYearlyResults",
				"type": "tuple[]"
			},
			{
				"components": [
					{
						"internalType": "bool",
						"name": "isGraduated",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "graduationGPA",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "decisionNumber",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "decisionDate",
						"type": "string"
					}
				],
				"internalType": "struct UniversityRecords.GraduationRecord",
				"name": "gradRecord",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_studentId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_planId",
				"type": "uint256"
			}
		],
		"name": "getStudentMarksForPlan",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "oralMark",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "writtenMark",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "finalMark",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalGrade",
						"type": "uint256"
					},
					{
						"internalType": "enum UniversityRecords.CoursePassStatus",
						"name": "passStatus",
						"type": "uint8"
					}
				],
				"internalType": "struct UniversityRecords.StudentCourseMarks",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_studentId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_studyYear",
				"type": "uint8"
			}
		],
		"name": "getYearlyResult",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "resultYear",
						"type": "string"
					},
					{
						"internalType": "uint8",
						"name": "studyYear",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "totalCreditsEarned",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalCreditsUnEarned",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "finalGPA",
						"type": "uint256"
					},
					{
						"internalType": "enum UniversityRecords.YearlyStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct UniversityRecords.StudentYearlyResult",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "graduationRecords",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isGraduated",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "graduationGPA",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "decisionNumber",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "decisionDate",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextPlanId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "planIdLookup",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "plans",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "planId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "courseCode",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "planYear",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "studyYear",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "theoreticalHours",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "practicalHours",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalHours",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "credits",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "oralWeight",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "writtenWeight",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "finalExamWeight",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isCreated",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "studentMarks",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "oralMark",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "writtenMark",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "finalMark",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalGrade",
				"type": "uint256"
			},
			{
				"internalType": "enum UniversityRecords.CoursePassStatus",
				"name": "passStatus",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "students",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "studentId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "fullName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "enrollmentYear",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isCreated",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "yearlyResults",
		"outputs": [
			{
				"internalType": "string",
				"name": "resultYear",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "studyYear",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "totalCreditsEarned",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalCreditsUnEarned",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "finalGPA",
				"type": "uint256"
			},
			{
				"internalType": "enum UniversityRecords.YearlyStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = "0xD2e9Dc63AAC92DdbA80D7dE2B99F2D5620b661DD";

// 3. Create Contract Instance
const universityContract = new web3.eth.Contract(contractABI, contractAddress);

// 4. Admin Account Setup
// IMPORTANT: Copy a PRIVATE KEY from your ganache-cli terminal
const adminPrivateKey = '0x96e1aed81122c2291b473cd6cd83c327cc8b57948fac551a8811f18f51c004eb'; 
const adminAccount = web3.eth.accounts.privateKeyToAccount(adminPrivateKey);
web3.eth.accounts.wallet.add(adminAccount);
const adminAddress = adminAccount.address;

// --- We will write our functions to call the contract below ---

/**
 * Function to add a new course to the smart contract.
 * @param {string} courseCode - The code of the course, e.g., "CS101".
 * @param {string} nameEn - The name in English.
 * @param {string} nameAr - The name in Arabic.
 * @param {number} courseType - 0 for ACADEMIC, 1 for PROJECT, 2 for RESEARCH.
 */
async function addNewCourse(courseCode, nameEn, nameAr, courseType) {
    try {
        console.log(`Attempting to add course: ${courseCode}...`);

        // Estimate gas cost
        const gasEstimate = await universityContract.methods.addCourse(courseCode, nameEn, nameAr, courseType).estimateGas({ from: adminAddress });

        // Send the transaction
        const tx = await universityContract.methods.addCourse(courseCode, nameEn, nameAr, courseType).send({
            from: adminAddress,
            gas: gasEstimate
        });

        console.log("Transaction successful!");
        console.log("Transaction Hash:", tx.transactionHash);
        
    } catch (error) {
        console.error("Error adding course:", error.message);
    }
}

/**
 * Function to add a new student.
 * @param {number} studentId - The student's official ID.
 * @param {string} fullName - The student's full name.
 * @param {number} enrollmentYear - The year of enrollment.
 */
async function addNewStudent(studentId, fullName, enrollmentYear) {
    try {
        console.log(`Attempting to add student: ${fullName}...`);

        const gasEstimate = await universityContract.methods.addStudent(studentId, fullName, enrollmentYear).estimateGas({ from: adminAddress });

        const tx = await universityContract.methods.addStudent(studentId, fullName, enrollmentYear).send({
            from: adminAddress,
            gas: gasEstimate
        });

        console.log("Student added successfully!");
        console.log("Transaction Hash:", tx.transactionHash);

    } catch (error) {
        console.error("Error adding student:", error.message);
    }
}

/**
 * Function to add a new study plan.
 */
async function addNewPlan(courseCode, planYear, studyYear, credits, weights, hours) {
    try {
        console.log(`Attempting to add plan for course: ${courseCode} in ${planYear}...`);

        const gasEstimate = await universityContract.methods.addPlan(courseCode, planYear, studyYear, credits, weights, hours).estimateGas({ from: adminAddress });

        const tx = await universityContract.methods.addPlan(courseCode, planYear, studyYear, credits, weights, hours).send({
            from: adminAddress,
            gas: gasEstimate
        });

        console.log("Plan added successfully!");
        console.log("Transaction Hash:", tx.transactionHash);

    } catch (error) {
        console.error("Error adding plan:", error.message);
    }
}

/**
 * Function to set marks for an academic course.
 */
async function setAcademicMarks(studentId, planId, oralMark, writtenMark, finalMark, totalGrade) {
    try {
        console.log(`Attempting to set academic marks for student ${studentId} in plan ${planId}...`);

        const gasEstimate = await universityContract.methods.setAcademicMarks(studentId, planId, oralMark, writtenMark, finalMark, totalGrade).estimateGas({ from: adminAddress });

        const tx = await universityContract.methods.setAcademicMarks(studentId, planId, oralMark, writtenMark, finalMark, totalGrade).send({
            from: adminAddress,
            gas: gasEstimate
        });

        console.log("Academic marks set successfully!");
        console.log("Transaction Hash:", tx.transactionHash);

    } catch (error) {
        console.error("Error setting academic marks:", error.message);
    }
}

/**
 * Function to set the grade for a project or research course.
 */
async function setProjectOrResearchGrade(studentId, planId, totalGrade) {
    try {
        console.log(`Attempting to set project grade for student ${studentId} in plan ${planId}...`);

        const gasEstimate = await universityContract.methods.setProjectOrResearchGrade(studentId, planId, totalGrade).estimateGas({ from: adminAddress });

        const tx = await universityContract.methods.setProjectOrResearchGrade(studentId, planId, totalGrade).send({
            from: adminAddress,
            gas: gasEstimate
        });

        console.log("Project/Research grade set successfully!");
        console.log("Transaction Hash:", tx.transactionHash);

    } catch (error) {
        console.error("Error setting project grade:", error.message);
    }
}

/**
 * Function to calculate and verify the yearly result.
 */
async function calculateAndVerifyGPA(studentId, resultYear, studyYear, providedGPA, planIds) {
    try {
        console.log(`Attempting to calculate result for student ${studentId} for study year ${studyYear}...`);

        const gasEstimate = await universityContract.methods.calculateAndVerifyGPA(studentId, resultYear, studyYear, providedGPA, planIds).estimateGas({ from: adminAddress });

        const tx = await universityContract.methods.calculateAndVerifyGPA(studentId, resultYear, studyYear, providedGPA, planIds).send({
            from: adminAddress,
            gas: gasEstimate
        });

        console.log("Yearly result calculated successfully!");
        console.log("Transaction Hash:", tx.transactionHash);

    } catch (error) {
        console.error("Error calculating result:", error.message);
    }
}

/**
 * Function to set the graduation record for a student.
 */
async function setGraduationRecord(studentId, graduationGPA, decisionNumber, decisionDate) {
    try {
        console.log(`Attempting to set graduation record for student ${studentId}...`);

        const gasEstimate = await universityContract.methods.setGraduationRecord(studentId, graduationGPA, decisionNumber, decisionDate).estimateGas({ from: adminAddress });

        const tx = await universityContract.methods.setGraduationRecord(studentId, graduationGPA, decisionNumber, decisionDate).send({
            from: adminAddress,
            gas: gasEstimate
        });

        console.log("Graduation record set successfully!");
        console.log("Transaction Hash:", tx.transactionHash);

    } catch (error) {
        console.error("Error setting graduation record:", error.message);
    }
}

async function main() {
    console.log(`Setup complete. Using admin account: ${adminAddress}`);
    // We will call our functions here to test them
}

main();