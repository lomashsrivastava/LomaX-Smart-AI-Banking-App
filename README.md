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
  - [Authentication & Home](#-authentication--home)
  - [Dashboard](#-dashboard)
  - [Account Management](#-account-management)
  - [Customer Management](#-customer-management)
  - [Transaction Management](#-transaction-management)
  - [Loan Management](#-loan-management)
  - [Card Management](#-card-management)
  - [Branch Management](#-branch-management)
  - [Employee Management](#-employee-management)
  - [Audit & Compliance](#-audit--compliance)
  - [Security Center](#-security-center)
  - [Notifications](#-notifications)
  - [Reports & Statements](#-reports--statements)
  - [Support Center](#-support-center)
  - [Settings & Administration](#-settings--administration)
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

### Authentication & Home

Secure login portal with role selection and a polished landing experience.

<p align="center">
  <img src="Screenshot%20Or%20UI%20Images/Main%20Or%20Home%20Page%20Interface.png" alt="LomaX Home Page" width="90%" />
</p>

<p align="center"><em>Main landing interface — <a href="https://lomaxbank.netlify.app/login">Open Live Login</a></em></p>

---

### Dashboard

Central command center with KPIs, analytics charts, and real-time system alerts.

<table>
  <tr>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Dashboard%20Home%201.png" alt="Dashboard Home" width="100%" />
      <br /><sub><b>Dashboard Overview</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Dashboard%20Home%20%202.png" alt="Dashboard Home 2" width="100%" />
      <br /><sub><b>Dashboard Insights</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Dashboard%20Analytics.png" alt="Dashboard Analytics" width="100%" />
      <br /><sub><b>Analytics & Metrics</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Dashboard%20System%20Alerts.png" alt="System Alerts" width="100%" />
      <br /><sub><b>System Alerts</b></sub>
    </td>
  </tr>
</table>

---

### Account Management

Open accounts, review pending approvals, and manage the full account lifecycle.

<table>
  <tr>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Account%20Managment%20Account%20List.png" alt="Account List" width="100%" />
      <br /><sub><b>Account List</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Account%20Managment%20Open%20New%20Account.png" alt="Open New Account" width="100%" />
      <br /><sub><b>Open New Account</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Account%20Managment%20%20Account%20Approval.png" alt="Account Approval" width="100%" />
      <br /><sub><b>Account Approval</b></sub>
    </td>
  </tr>
</table>

---

### Customer Management

Register customers, track KYC status, and maintain customer profiles.

<table>
  <tr>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Customer%20Managment%20Customer%20List.png" alt="Customer List" width="100%" />
      <br /><sub><b>Customer List</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Customer%20Managment%20Register%20Customer.png" alt="Register Customer" width="100%" />
      <br /><sub><b>Register Customer</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Customer%20Managment%20Pending%20KYC.png" alt="Pending KYC" width="100%" />
      <br /><sub><b>Pending KYC</b></sub>
    </td>
  </tr>
</table>

---

### Transaction Management

Deposit, withdraw, transfer funds, and browse complete transaction history.

<table>
  <tr>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Transaction%20Management%20Cash%20Deposit.png" alt="Cash Deposit" width="100%" />
      <br /><sub><b>Cash Deposit</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Transaction%20Management%20Cash%20Withdrawal.png" alt="Cash Withdrawal" width="100%" />
      <br /><sub><b>Cash Withdrawal</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Transaction%20Management%20Fund%20Transfer.png" alt="Fund Transfer" width="100%" />
      <br /><sub><b>Fund Transfer</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Transaction%20Management%20Transaction%20History.png" alt="Transaction History" width="100%" />
      <br /><sub><b>Transaction History</b></sub>
    </td>
  </tr>
</table>

---

### Loan Management

Apply for loans, review applications, and track active loan portfolios.

<table>
  <tr>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Loan%20Management%20%20Active%20Loans.png" alt="Active Loans" width="100%" />
      <br /><sub><b>Active Loans</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Loan%20Management%20Apply%20Loan.png" alt="Apply Loan" width="100%" />
      <br /><sub><b>Apply for Loan</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Loan%20Management%20Loan%20Applications.png" alt="Loan Applications" width="100%" />
      <br /><sub><b>Loan Applications</b></sub>
    </td>
  </tr>
</table>

---

### Card Management

Issue debit cards, manage card controls, and monitor card activity.

<table>
  <tr>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Card%20Management%20Card%20List.png" alt="Card List" width="100%" />
      <br /><sub><b>Card List</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Card%20Management%20Issue%20Debit%20Card.png" alt="Issue Debit Card" width="100%" />
      <br /><sub><b>Issue Debit Card</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Card%20Management%20Card%20Controls.png" alt="Card Controls" width="100%" />
      <br /><sub><b>Card Controls</b></sub>
    </td>
  </tr>
</table>

---

### Branch Management

Manage branches across regions with reporting and onboarding workflows.

<table>
  <tr>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Branch%20Management%20Branch%20List.png" alt="Branch List" width="100%" />
      <br /><sub><b>Branch List</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Branch%20Management%20Add%20Branch.png" alt="Add Branch" width="100%" />
      <br /><sub><b>Add Branch</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Branch%20Management%20Branch%20Reports.png" alt="Branch Reports" width="100%" />
      <br /><sub><b>Branch Reports</b></sub>
    </td>
  </tr>
</table>

---

### Employee Management

Staff directory, role assignment, and permission management.

<table>
  <tr>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Employee%20Managment%20Employee%20List.png" alt="Employee List" width="100%" />
      <br /><sub><b>Employee List</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Employee%20Managment%20Roles%20%26%20Permissons.png" alt="Roles and Permissions" width="100%" />
      <br /><sub><b>Roles & Permissions</b></sub>
    </td>
  </tr>
</table>

---

### Audit & Compliance

Immutable audit logs and AML monitoring for regulatory compliance.

<table>
  <tr>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Audit%20%26%20Compliance%20Audit%20Logs.png" alt="Audit Logs" width="100%" />
      <br /><sub><b>Audit Logs</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Audit%20%26%20Compliance%20AML%20Monitoring.png" alt="AML Monitoring" width="100%" />
      <br /><sub><b>AML Monitoring</b></sub>
    </td>
  </tr>
</table>

---

### Security Center

Track login history and manage trusted devices across the platform.

<table>
  <tr>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Security%20Center%20Login%20History.png" alt="Login History" width="100%" />
      <br /><sub><b>Login History</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Security%20Center%20Device%20Management.png" alt="Device Management" width="100%" />
      <br /><sub><b>Device Management</b></sub>
    </td>
  </tr>
</table>

---

### Notifications

Send alerts to customers and review notification history.

<table>
  <tr>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Notification%20Center%20Send%20Notification.png" alt="Send Notification" width="100%" />
      <br /><sub><b>Send Notification</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Notification%20Center%20Alert%20History.png" alt="Alert History" width="100%" />
      <br /><sub><b>Alert History</b></sub>
    </td>
  </tr>
</table>

---

### Reports & Statements

Generate account statements and detailed transaction reports.

<table>
  <tr>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Statement%20%26%20Reports%20Account%20Statements.png" alt="Account Statements" width="100%" />
      <br /><sub><b>Account Statements</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Statement%20%26%20Reports%20%20Transaction%20Reports.png" alt="Transaction Reports" width="100%" />
      <br /><sub><b>Transaction Reports</b></sub>
    </td>
  </tr>
</table>

---

### Support Center

Live chat and ticket-based customer support.

<table>
  <tr>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Support%20Center%20Live%20Chat.png" alt="Live Chat" width="100%" />
      <br /><sub><b>Live Chat</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="Screenshot%20Or%20UI%20Images/Support%20Center%20Ticket%20History.png" alt="Ticket History" width="100%" />
      <br /><sub><b>Ticket History</b></sub>
    </td>
  </tr>
</table>

---

### Settings & Administration

System preferences, general settings, and administrator security controls.

<table>
  <tr>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Settings%20General%20Settings.png" alt="General Settings" width="100%" />
      <br /><sub><b>General Settings</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/Settings%20System%20Preferences.png" alt="System Preferences" width="100%" />
      <br /><sub><b>System Preferences</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="Screenshot%20Or%20UI%20Images/System%20Administrator%20Change%20Password.png" alt="Change Password" width="100%" />
      <br /><sub><b>Change Password</b></sub>
    </td>
  </tr>
</table>

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
