<div align="center">

# LomaX — Smart AI Banking Platform

**Enterprise-grade digital banking built for customers, staff, and administrators.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://lomaxbank.netlify.app/login)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-97%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<br />

[**Open Live App**](https://lomaxbank.netlify.app/login) · [**View Repository**](https://github.com/lomashsrivastava/LomaX-Smart-AI-Banking-App) · [**Report Bug**](https://github.com/lomashsrivastava/LomaX-Smart-AI-Banking-App/issues)

<br />

<img src="frontend/public/lomax-logo.png" alt="LomaX Logo" width="120" />

</div>

---

## About LomaX

**LomaX** is a full-stack digital banking platform with a cybernetic dark-theme UI, secure authentication, double-entry ledger transactions, and role-based portals for **customers**, **staff**, and **admins**. It includes a Next.js web app, Express.js API, MongoDB backend, and a React Native (Expo) mobile client.

> **Try it live:** [https://lomaxbank.netlify.app/login](https://lomaxbank.netlify.app/login)

---

## Table of Contents

- [Live Demo](#-live-demo)
- [Platform Highlights](#-platform-highlights)
- [Feature Showcase](#-feature-showcase)
  - [🖥️ Admin & Operational Modules](#-admin--operational-modules)
  - [👤 Customer Portal & Ledger Transactions](#-customer-portal--ledger-transactions)
- [Mobile App Portal](#-mobile-app-portal-react-native)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Author](#-author)

---

## Live Demo

| | |
|:---:|:---:|
| **Web App (Netlify)** | [lomaxbank.netlify.app/login](https://lomaxbank.netlify.app/login) |
| **GitHub Repository** | [LomaX-Smart-AI-Banking-App](https://github.com/lomashsrivastava/LomaX-Smart-AI-Banking-App) |

Log in with **Customer**, **Admin**, or **Staff** roles to explore the full banking experience.

---

## Platform Highlights

| Feature | Description |
|---------|-------------|
| **Secure Authentication** | JWT-based login with role-based access for customers, staff, and admins |
| **Double-Entry Ledger** | ACID-compliant transactions with debit/credit validation |
| **Admin Dashboard** | Real-time analytics, alerts, and system-wide oversight |
| **Customer Banking** | Accounts, transfers, cards, loans, statements, and notifications |
| **Branch & Employee Ops** | Multi-branch management with region-based cascading filters |
| **Audit & Compliance** | AML monitoring, fraud detection, and immutable audit logs |
| **Mobile App** | Cross-platform React Native (Expo) banking on iOS & Android |
| **Cloud Ready** | Deployed on **Netlify** (frontend) and **Render** (backend) with Docker support |

---

## Feature Showcase

### 🖥️ Admin & Operational Modules
Unified dashboard command centers, regional branch networks, staff directories, security session logs, AML fraud compliance, and customer chat tools.

| | | | |
|:---:|:---:|:---:|:---:|
| <img src="Screenshot%20Or%20UI%20Images/Dashboard%20Home%201.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Dashboard%20Home%20%202.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Dashboard%20Analytics.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Dashboard%20System%20Alerts.jpg" width="100%"/> |
| **Command Console** | **KPI Insights** | **Trend Analytics** | **Threat Warnings** |
| <img src="Screenshot%20Or%20UI%20Images/Branch%20Management%20Add%20Branch.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Branch%20Management%20Branch%20List.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Branch%20Management%20Branch%20Reports.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Employee%20Managment%20Employee%20List.jpg" width="100%"/> |
| **Add Branch** | **Branch Directory** | **Region Analytics** | **Staff Directory** |
| <img src="Screenshot%20Or%20UI%20Images/Employee%20Managment%20Roles%20%26%20Permissons.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Audit%20%26%20Compliance%20AML%20Monitoring.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Audit%20%26%20Compliance%20Audit%20Logs.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Security%20Center%20Device%20Management.jpg" width="100%"/> |
| **Access Rights** | **AML Fraud Check** | **Audit Trail** | **Active Sessions** |
| <img src="Screenshot%20Or%20UI%20Images/Security%20Center%20Login%20History.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Notification%20Center%20Send%20Notification.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Notification%20Center%20Alert%20History.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Support%20Center%20Live%20Chat.jpg" width="100%"/> |
| **Login Audits** | **Broadcast Alerts** | **Alert Logs** | **Live Support Chat** |
| <img src="Screenshot%20Or%20UI%20Images/Support%20Center%20Ticket%20History.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Settings%20General%20Settings.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Settings%20System%20Preferences.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/System%20Administrator%20Change%20Password.jpg" width="100%"/> |
| **Ticket Manager** | **Core Settings** | **Preferences** | **Security Rotation** |

---

### 👤 Customer Portal & Ledger Transactions
Onboarding screens, deposit accounts configuration, ledger fund transfers, debit cards control, and loan underwriting.

| | | | |
|:---:|:---:|:---:|:---:|
| <img src="Screenshot%20Or%20UI%20Images/Main%20Or%20Home%20Page%20Interface.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Customer%20Managment%20Register%20Customer.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Customer%20Managment%20Pending%20KYC.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Account%20Managment%20Open%20New%20Account.jpg" width="100%"/> |
| **Login Landing** | **Onboarding Form** | **KYC Review** | **Create Account** |
| <img src="Screenshot%20Or%20UI%20Images/Account%20Managment%20Account%20List.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Account%20Managment%20%20Account%20Approval.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Transaction%20Management%20Fund%20Transfer.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Transaction%20Management%20Cash%20Deposit.jpg" width="100%"/> |
| **Deposit Accounts** | **New Approvals** | **ACID Transfer** | **Cash Deposit** |
| <img src="Screenshot%20Or%20UI%20Images/Transaction%20Management%20Cash%20Withdrawal.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Transaction%20Management%20Transaction%20History.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Statement%20%26%20Reports%20Account%20Statements.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Statement%20%26%20Reports%20%20Transaction%20Reports.jpg" width="100%"/> |
| **Cash Withdrawal** | **Ledger Logs** | **PDF Statements** | **Custom Search** |
| <img src="Screenshot%20Or%20UI%20Images/Card%20Management%20Issue%20Debit%20Card.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Card%20Management%20Card%20Controls.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Loan%20Management%20Apply%20Loan.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Loan%20Management%20Loan%20Applications.jpg" width="100%"/> |
| **Card Issuance** | **Usage Toggles** | **Loan Apply** | **Underwriting Queue**|
| <img src="Screenshot%20Or%20UI%20Images/Loan%20Management%20%20Active%20Loans.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Card%20Management%20Card%20List.jpg" width="100%"/> | <img src="Screenshot%20Or%20UI%20Images/Customer%20Managment%20Customer%20List.jpg" width="100%"/> | |
| **Active Loans** | **Cards Registry** | **User Directory** | |

---

## Mobile App Portal (React Native)

LomaX features a premium cross-platform mobile app built with **React Native** and **Expo**, enabling customers to handle their banking on the go.

### 📱 Mobile Features & Capabilities
* **Interactive Dashboard**: Real-time balance updates, quick transaction history, and custom account summary.
* **Card Control Module**: Lock/unlock cards, set transaction limits, and manage ATM settings dynamically.
* **Intelligent Fund Transfers**: Scan and transfer or input details to execute double-entry ledger transfers with instant notification popups.
* **Audit & Security**: Custom device identification and location logging for all login sessions to protect account integrity.
* **Biometric Auth Simulation**: Pre-configured support for modern device security modules.

### 📥 Direct APK Installation
You can download and run the mobile app directly on your Android phone using our pre-compiled EAS cloud artifact:

* **Direct Download**: [Download LomaX Android APK](https://expo.dev/artifacts/eas/3b9nlnjp7BEzFczqarCBpb0bj1bkZwMZTGIuXbYZQ44.apk)
* **Scan to Install**:
  
  <p align="left">
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fexpo.dev%2Fartifacts%2Feas%2F3b9nlnjp7BEzFczqarCBpb0bj1bkZwMZTGIuXbYZQ44.apk&color=10b981&bgcolor=020617" alt="LomaX Mobile App QR Code" width="150" />
  </p>

### 🔑 Demo Login Details
Open the app and log in using the case-insensitive demo user credentials:
* **Customer ID**: `CUST411279`
* **Password**: `972114TSUC` (reverse of the Customer ID)

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend (Web)** | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| **Backend (API)** | Node.js, Express 5, TypeScript, JWT, bcrypt, Helmet, Rate Limiting |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Mobile** | React Native, Expo 56, Expo Router, Zustand |
| **DevOps** | Docker, GitHub Actions CI, Netlify, Render |
| **Security** | JWT auth, RBAC, audit logging, session management, CORS |

---

## Project Structure

```text
LomaX/
├── frontend/          # Next.js web application (Admin + Customer portals)
├── backend/           # Express.js REST API & business logic
├── Mobile App/        # React Native (Expo) mobile banking app
├── Screenshot Or UI Images/   # UI screenshots for documentation
├── docs/              # Technical documentation
├── .github/workflows/ # CI/CD pipelines
├── docker-compose.yml # Local multi-service orchestration
└── netlify.toml       # Netlify deployment configuration
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/lomashsrivastava/LomaX-Smart-AI-Banking-App.git
cd LomaX-Smart-AI-Banking-App
```

### 2. Start the backend

```bash
cd backend
npm install
cp .env.example .env   # Configure MONGODB_URI, JWT_SECRET, etc.
npm run dev
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. (Optional) Start the mobile app

```bash
cd "Mobile App/lomax-mobile"
npm install
npx expo start
```

### Docker (all services)

```bash
docker-compose up --build
```

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| **Frontend** | Netlify | [lomaxbank.netlify.app](https://lomaxbank.netlify.app/login) |
| **Backend** | Render | Configure `NEXT_PUBLIC_API_URL` in Netlify to point to your Render API |
| **Database** | MongoDB Atlas | Cloud-hosted MongoDB cluster |

---

## Author

**Lomash Srivastava**

- GitHub: [@lomashsrivastava](https://github.com/lomashsrivastava)
- Repository: [LomaX-Smart-AI-Banking-App](https://github.com/lomashsrivastava/LomaX-Smart-AI-Banking-App)

---

<div align="center">

**LomaX** — Smart AI Banking Platform

If you find this project useful, consider giving it a star on GitHub.

</div>
