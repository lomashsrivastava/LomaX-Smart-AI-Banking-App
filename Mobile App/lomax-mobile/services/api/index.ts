import client from './client';
import { ENDPOINTS } from '@/constants/endpoints';

export const accountsApi = {
  getAccounts: (customerId: string) =>
    client.get(ENDPOINTS.ACCOUNTS(customerId)),

  getLiveData: (accountNumber: string) =>
    client.get(ENDPOINTS.ACCOUNT_LIVE(accountNumber)),
};

export const transactionsApi = {
  transfer: (data: Record<string, unknown>) =>
    client.post(ENDPOINTS.TRANSFER, data),

  deposit: (data: Record<string, unknown>) =>
    client.post(ENDPOINTS.DEPOSIT, data),

  withdraw: (data: Record<string, unknown>) =>
    client.post(ENDPOINTS.WITHDRAW, data),

  getHistory: (params?: Record<string, unknown>) =>
    client.get(ENDPOINTS.HISTORY, { params }),

  getAccountHistory: (accountNumber: string, params?: Record<string, unknown>) =>
    client.get(ENDPOINTS.ACCOUNT_HISTORY(accountNumber), { params }),

  lookupAccount: (accountNumber: string) =>
    client.get(ENDPOINTS.LOOKUP_ACCOUNT(accountNumber)),

  getStatementPDF: (params: Record<string, unknown>) =>
    client.get(ENDPOINTS.STATEMENT_PDF, { params, responseType: 'blob' }),

  getStatementCSV: (params: Record<string, unknown>) =>
    client.get(ENDPOINTS.STATEMENT_CSV, { params, responseType: 'text' }),
};

export const cardsApi = {
  getCards: () => client.get(ENDPOINTS.CARDS),

  getCardsByAccount: (accountNumber: string) =>
    client.get(ENDPOINTS.CARDS_BY_ACCOUNT(accountNumber)),

  issueCard: (data: Record<string, unknown>) =>
    client.post(ENDPOINTS.ISSUE_CARD, data),

  updateStatus: (id: string, status: string) =>
    client.put(ENDPOINTS.CARD_STATUS(id), { status }),

  updateControls: (id: string, controls: Record<string, boolean>) =>
    client.put(ENDPOINTS.CARD_CONTROLS(id), controls),
};

export const loansApi = {
  getLoans: () => client.get(ENDPOINTS.LOANS),

  apply: (data: Record<string, unknown>) =>
    client.post(ENDPOINTS.APPLY_LOAN, data),

  updateStatus: (id: string, status: string) =>
    client.put(ENDPOINTS.LOAN_STATUS(id), { status }),
};

export const analyticsApi = {
  getSmart: () => client.get(ENDPOINTS.ANALYTICS_SMART),

  getBudgets: () => client.get(ENDPOINTS.BUDGETS),

  setBudget: (data: Record<string, unknown>) =>
    client.post(ENDPOINTS.BUDGETS, data),

  getSavings: () => client.get(ENDPOINTS.SAVINGS),

  createSavingsGoal: (data: Record<string, unknown>) =>
    client.post(ENDPOINTS.SAVINGS, data),

  addDeposit: (data: Record<string, unknown>) =>
    client.post(ENDPOINTS.SAVINGS_DEPOSIT, data),
};

export const notificationsApi = {
  getAll: () => client.get(ENDPOINTS.NOTIFICATIONS),

  markRead: (id: string) =>
    client.patch(ENDPOINTS.NOTIFICATION_READ(id)),

  markAllRead: () =>
    client.post(ENDPOINTS.NOTIFICATIONS_READ_ALL),
};

export const beneficiariesApi = {
  getAll: () => client.get(ENDPOINTS.BENEFICIARIES),

  add: (data: Record<string, unknown>) =>
    client.post(ENDPOINTS.BENEFICIARIES, data),

  delete: (id: string) =>
    client.delete(ENDPOINTS.BENEFICIARY_DELETE(id)),
};

export const scheduledApi = {
  getAll: () => client.get(ENDPOINTS.SCHEDULED),

  create: (data: Record<string, unknown>) =>
    client.post(ENDPOINTS.SCHEDULED, data),

  cancel: (id: string) =>
    client.patch(ENDPOINTS.SCHEDULED_CANCEL(id)),
};
