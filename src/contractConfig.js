// This is the Application Binary Interface (ABI) of your contract.
export const contractABI =[
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
				"name": "_academicYear",
				"type": "string"
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
				"name": "_academicYear",
				"type": "string"
			},
			{
				"internalType": "uint256[]",
				"name": "_planIds",
				"type": "uint256[]"
			}
		],
		"name": "calculateYearlyResult",
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
			}
		],
		"name": "setAcademicMarks",
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
				"name": "academicYear",
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
				"name": "academicYear",
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
						"internalType": "bool",
						"name": "isPassed",
						"type": "bool"
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
				"internalType": "string",
				"name": "_academicYear",
				"type": "string"
			}
		],
		"name": "getYearlyResult",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "academicYear",
						"type": "string"
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
				"name": "academicYear",
				"type": "string"
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
				"internalType": "bool",
				"name": "isPassed",
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
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "yearlyResults",
		"outputs": [
			{
				"internalType": "string",
				"name": "academicYear",
				"type": "string"
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

// This is the address of your deployed contract on the Ganache network.
export const contractAddress = "0xd1dA4C5d627c00Fa3323dc3b5ebECcD76da7aAb6";