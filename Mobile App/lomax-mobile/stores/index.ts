import { create } from 'zustand';

interface Account {
  _id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  status: string;
  branchName: string;
  branchCode: string;
  ifscCode: string;
  services: Record<string, boolean>;
}

interface AccountsState {
  accounts: Account[];
  selectedAccount: Account | null;
  isLoading: boolean;
  error: string | null;
  setAccounts: (accounts: Account[]) => void;
  selectAccount: (account: Account | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAccountsStore = create<AccountsState>((set) => ({
  accounts: [],
  selectedAccount: null,
  isLoading: false,
  error: null,
  setAccounts: (accounts) => set({ accounts }),
  selectAccount: (account) => set({ selectedAccount: account }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

interface Transaction {
  _id: string;
  transactionId: string;
  type: string;
  transferMode: string;
  amount: number;
  remarks: string;
  payeeName: string;
  status: string;
  createdAt: string;
  sourceAccount?: string;
  targetAccount?: string;
}

interface TransactionsState {
  transactions: Transaction[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  setTransactions: (txns: Transaction[]) => void;
  appendTransactions: (txns: Transaction[]) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  error: null,
  setTransactions: (transactions) => set({ transactions }),
  appendTransactions: (txns) =>
    set((state) => ({ transactions: [...state.transactions, ...txns] })),
  setPage: (page) => set({ page }),
  setHasMore: (hasMore) => set({ hasMore }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ transactions: [], page: 1, hasMore: true }),
}));

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  setNotifications: (notifications: Notification[]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  setLoading: (loading: boolean) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  setNotifications: (notifications) =>
    set({ notifications, unreadCount: notifications.filter((n) => !n.read).length }),
  markRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
      );
      return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
    }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
