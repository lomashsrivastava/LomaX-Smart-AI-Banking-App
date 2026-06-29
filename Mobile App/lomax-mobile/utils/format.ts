export const formatCurrency = (amount: number, currency = 'INR'): string => {
  if (isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatCompactCurrency = (amount: number): string => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toFixed(0)}`;
};

export const formatDate = (date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';

  if (format === 'time') {
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
  if (format === 'long') {
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }
  return d.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const formatAccountNumber = (accountNumber: string): string => {
  if (!accountNumber) return '';
  return accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
};

export const maskAccountNumber = (accountNumber: string): string => {
  if (!accountNumber) return '';
  const str = accountNumber.toString();
  return `•••• •••• ${str.slice(-4)}`;
};

export const formatCustomerId = (id: string): string => id?.toUpperCase() || '';

export const getInitials = (name: string): string => {
  if (!name) return 'DC';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

export const getTransactionIcon = (type: string): string => {
  switch (type?.toLowerCase()) {
    case 'credit': return 'arrow-down-circle';
    case 'debit': return 'arrow-up-circle';
    case 'transfer': return 'swap-horizontal';
    default: return 'ellipse';
  }
};

export const getStatusColor = (status: string, colors: Record<string, string>): string => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'active':
    case 'approved':
      return colors.success;
    case 'pending':
    case 'processing':
      return colors.warning;
    case 'failed':
    case 'rejected':
    case 'blocked':
      return colors.error;
    default:
      return colors.textMuted;
  }
};

export const reverseString = (str: string): string =>
  str.split('').reverse().join('');
