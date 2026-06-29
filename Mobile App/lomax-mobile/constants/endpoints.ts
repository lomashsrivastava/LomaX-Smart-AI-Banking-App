export const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000';

export const ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  CHANGE_PASSWORD: '/api/auth/change-password',
  SESSIONS: '/api/auth/sessions',
  SESSION_REVOKE: (id: string) => `/api/auth/sessions/${id}`,
  TWO_FA_STATUS: '/api/auth/2fa/status',
  TWO_FA_TOGGLE: '/api/auth/2fa/toggle',

  // Accounts
  ACCOUNTS: (customerId: string) => `/api/accounts/${customerId}`,
  ACCOUNT_LIVE: (accountNumber: string) => `/api/accounts/live/${accountNumber}`,

  // Transactions
  TRANSFER: '/api/transactions/transfer',
  DEPOSIT: '/api/transactions/deposit',
  WITHDRAW: '/api/transactions/withdraw',
  HISTORY: '/api/transactions/history',
  ACCOUNT_HISTORY: (accountNumber: string) => `/api/transactions/account/${accountNumber}`,
  LOOKUP_ACCOUNT: (accountNumber: string) => `/api/transactions/lookup/${accountNumber}`,
  STATEMENT_PDF: '/api/transactions/statement/pdf',
  STATEMENT_CSV: '/api/transactions/statement/csv',

  // Cards
  CARDS: '/api/cards',
  CARDS_BY_ACCOUNT: (accountNumber: string) => `/api/cards/account/${accountNumber}`,
  ISSUE_CARD: '/api/cards/issue',
  CARD_STATUS: (id: string) => `/api/cards/${id}/status`,
  CARD_CONTROLS: (id: string) => `/api/cards/${id}/controls`,

  // Loans
  LOANS: '/api/loans',
  APPLY_LOAN: '/api/loans/apply',
  LOAN_STATUS: (id: string) => `/api/loans/${id}/status`,

  // Analytics
  ANALYTICS_SMART: '/api/analytics/smart',
  BUDGETS: '/api/analytics/budgets',
  SAVINGS: '/api/analytics/savings',
  SAVINGS_DEPOSIT: '/api/analytics/savings/deposit',

  // Notifications
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATION_READ: (id: string) => `/api/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: '/api/notifications/read-all',

  // Beneficiaries
  BENEFICIARIES: '/api/beneficiaries',
  BENEFICIARY_DELETE: (id: string) => `/api/beneficiaries/${id}`,

  // Scheduled Transfers
  SCHEDULED: '/api/scheduled-transfers',
  SCHEDULED_CANCEL: (id: string) => `/api/scheduled-transfers/${id}/cancel`,
};
