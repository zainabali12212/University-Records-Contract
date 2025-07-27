// 1. Setup Connection
const Web3 = require('web3');
const ganacheUrl = 'http://127.0.0.1:8545'; // Make sure this is your ganache-cli URL
const web3 = new Web3(ganacheUrl);

// 2. Contract Details
// IMPORTANT: Copy the final ABI and Address here
const contractABI = [/* ABI */];

const contractAddress = "DEPLOYED ADDRESS";

// 3. Create Contract Instance
const universityContract = new web3.eth.Contract(contractABI, contractAddress);

// 4. Admin Account Setup
// IMPORTANT: Copy a PRIVATE KEY from your ganache-cli terminal
const adminPrivateKey = 'PRIVATE KEY'; 
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