# University Academic Records on Blockchain

This project is a decentralized application (DApp) for managing and verifying university academic records using blockchain technology. It aims to create a secure, immutable, and transparent single source of truth for student data.

## Architecture Overview

The system is designed with a clear separation of concerns, consisting of three main layers:

1.  **Smart Contract (Back-end):** The core of the system, written in Solidity. It acts as the secure and immutable ledger for all academic data and contains the verification logic.
2.  **Admin API Layer (Intermediary):** A Node.js script (`api.js`) that acts as a secure gateway for administrative tasks. It simulates an external system, receives requests via an Express server, and is the only component authorized to write data to the smart contract.
3.  **Front-end (Read-Only UI):** A React application that serves as a public-facing portal for viewing and verifying on-chain data. It connects directly to the blockchain via MetaMask for read operations.

---

## Technologies and Tools

* **Smart Contract:**
    * **Language:** Solidity `^0.8.7`
    * **Compiler:** Must be set to a `0.8.7` version in Remix IDE to avoid deployment failures (Gas estimation failed)".
* **Blockchain Network:**
    * **Tool:** Ganache-CLI
* **Admin Script:**
    * **Environment:** Node.js
    * **Framework:** Express.js
    * **Library:** Web3.js `v1.10.0`
    * **Client:** Postman
* **Front-end:**
    * **Library:** React (created via Vite)
    * **Library:** Web3.js `v1.10.0`
    * **Wallet:** MetaMask
* **Version Control:**
    * **Tools:** Git and GitHub are used to manage and share the source code.

---

## Setup and Installation

### Prerequisites
* Node.js and npm installed.
* Ganache-CLI installed globally (`npm install -g ganache-cli`).
* MetaMask browser extension installed.

### Installation Steps
1.  **Clone the repository:**
    Replace `<https://github.com/zainabali12212/University-Records-Contract.git>` with the actual HTTPS URL of your repository.
    ```bash
    git clone <https://github.com/zainabali12212/University-Records-Contract.git>
    cd University-Records-Contract
    ```

2.  **Install front-end dependencies:**
    The `npm install` command reads the `package.json` file and automatically installs all required libraries (like React and web3.js).
    ```bash
    npm install
    ```

3.  **Install admin script dependencies:**
    This command reads the `package.json` inside the `admin-scripts` folder and installs its dependencies (like express and web3.js).
    ```bash
    cd admin-scripts
    npm install
    cd ..
    ```
---

## Execution Workflow

Follow these steps in order to run the full project.

**Step 1: Start the Local Blockchain**
* Open a new terminal and run `ganache-cli`. It will display 10 accounts with their private keys. Keep this terminal running.

**Step 2: Configure MetaMask**
* Add a new custom network to MetaMask pointing to your local Ganache instance (RPC URL: `http://127.0.0.1:8545`, Chain ID: `1337`).
* Import an account from the `ganache-cli` output into MetaMask using its private key. This will be your admin/owner account.

**Step 3: Deploy the Smart Contract**
* Open the project folder in Remix IDE.
* Go to the "Solidity Compiler" tab, select a compiler version of `0.8.7`, and compile `UniversityRecords.sol`.
* Go to the "Deploy & Run Transactions" tab.
* For `ENVIRONMENT`, select **Injected Provider - MetaMask**. Ensure MetaMask is connected to your Ganache network and the imported admin account is selected.
* Click **Deploy**.
* After deployment, copy the final **ABI** from the compiler tab and the **deployed contract address** from under "Deployed Contracts".

**Step 4: Configure and Run the Admin Script**
* Open the project in VS Code.
* Navigate to the `admin-scripts/api.js` file.
* Paste the copied **ABI** and **contract address** into the corresponding variables.
* Paste the **private key** of your chosen admin account (from `ganache-cli`) into the `adminPrivateKey` variable.
* Open a new terminal in VS Code, navigate to the `admin-scripts` folder (`cd admin-scripts`), and run the server:
    ```bash
    node api.js
    ```
    Keep this server running.

**Step 5: Use Postman to Add Data**
* Use Postman to send `POST` requests to the running `api.js` server (e.g., `http://localhost:3001/addStudent`) to populate the blockchain with test data.

**Step 6: Configure and Run the Front-end**
* Navigate to the `src/contractConfig.js` file.
* Paste the same **ABI** and **contract address** into the corresponding variables.
* Open a new terminal in VS Code at the project's root directory (`university-frontend`).
* Run the React application:
    ```bash
    npm run dev
    ```

**Step 7: View the Data**
* Open the `http://localhost:5173` link in your browser.
* Connect your MetaMask wallet.
* Use the search and verification forms to view the data you added via Postman.