// Import necessary libraries
const express = require('express');
const Web3 = require('web3');

// --- CONFIGURATION ---
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const ganacheUrl = 'http://127.0.0.1:8545';
const web3 = new Web3(ganacheUrl);

const contractABI = [/* ABI */];
const contractAddress = "ADDRESS OF DEPLOYED CONTRACT";
const adminPrivateKey = 'PRIVATEKEY';

// --- SETUP ---
const universityContract = new web3.eth.Contract(contractABI, contractAddress);
const adminAccount = web3.eth.accounts.privateKeyToAccount(adminPrivateKey);
web3.eth.accounts.wallet.add(adminAccount);
const adminAddress = adminAccount.address;

console.log(`Admin account loaded: ${adminAddress}`);

// --- API ENDPOINTS ---

// Endpoint to add a student
app.post('/addStudent', async (req, res) => {
    try {
        const { studentId, fullName, enrollmentYear } = req.body;
        console.log(`Received request to add student: ${fullName}`);

        const tx = await universityContract.methods.addStudent(studentId, fullName, enrollmentYear).send({
            from: adminAddress,
            gas: 6721975  // Gas Limit
        });
        
        res.status(200).send({ message: "Student added successfully!", txHash: tx.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error adding student", error: error.message });
    }
});

// Endpoint to add a course
app.post('/addCourse', async (req, res) => {
    try {
        const { courseCode, nameEn, nameAr, courseType } = req.body;
        console.log(`Received request to add course: ${courseCode}`);

        const tx = await universityContract.methods.addCourse(courseCode, nameEn, nameAr, courseType).send({
            from: adminAddress,
            gas: 6721975  // Gas Limit
        });
        
        res.status(200).send({ message: "Course added successfully!", txHash: tx.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error adding course", error: error.message });
    }
});

// Endpoint to add a plan
app.post('/addPlan', async (req, res) => {
    try {
        const { courseCode, planYear, studyYear, credits, weights, hours } = req.body;
        console.log(`Received request to add plan for course: ${courseCode}`);

        const tx = await universityContract.methods.addPlan(courseCode, planYear, studyYear, credits, weights, hours).send({
            from: adminAddress,
            gas: 6721975  // Gas Limit
        });
        
        res.status(200).send({ message: "Plan added successfully!", txHash: tx.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error adding plan", error: error.message });
    }
});

// Endpoint to set academic marks
app.post('/setAcademicMarks', async (req, res) => {
    try {
        const { studentId, planId, oralMark, writtenMark, finalMark, totalGrade } = req.body;
        console.log(`Received request to set academic marks for student: ${studentId}`);

        const tx = await universityContract.methods.setAcademicMarks(studentId, planId, oralMark, writtenMark, finalMark, totalGrade).send({
            from: adminAddress,
            gas: 6721975  // Gas Limit
        });
        
        res.status(200).send({ message: "Academic marks set successfully!", txHash: tx.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error setting academic marks", error: error.message });
    }
});

// Endpoint to set project/research grade
app.post('/setProjectGrade', async (req, res) => {
    try {
        const { studentId, planId, totalGrade } = req.body;
        console.log(`Received request to set project grade for student: ${studentId}`);

        const tx = await universityContract.methods.setProjectOrResearchGrade(studentId, planId, totalGrade).send({
            from: adminAddress,
            gas: 6721975  // Gas Limit
        });
        
        res.status(200).send({ message: "Project grade set successfully!", txHash: tx.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error setting project grade", error: error.message });
    }
});

// Endpoint to calculate and verify the yearly result
app.post('/calculateResult', async (req, res) => {
    try {
        const { studentId, resultYear, studyYear, providedGPA, planIds } = req.body;
        console.log(`Received request to calculate result for student: ${studentId}`);

        const tx = await universityContract.methods.calculateAndVerifyGPA(studentId, resultYear, studyYear, providedGPA, planIds).send({
            from: adminAddress,
            gas: 6721975  // Gas Limit 
        });
        
        res.status(200).send({ message: "Yearly result calculated successfully!", txHash: tx.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error calculating result", error: error.message });
    }
});

// Endpoint to set the graduation record
app.post('/setGraduationRecord', async (req, res) => {
    try {
        const { studentId, graduationGPA, decisionNumber, decisionDate } = req.body;
        console.log(`Received request to set graduation record for student: ${studentId}`);

        const tx = await universityContract.methods.setGraduationRecord(studentId, graduationGPA, decisionNumber, decisionDate).send({
            from: adminAddress,
            gas: 2000000
        });
        
        res.status(200).send({ message: "Graduation record set successfully!", txHash: tx.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error setting graduation record", error: error.message });
    }
});

// --- START SERVER ---
const port = 3001; // We use a different port than our React app
app.listen(port, () => {
    console.log(`Admin API server is running on http://localhost:${port}`);
});