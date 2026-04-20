/**
 * Formats a number as INR (₹)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a date string to a human-readable format
 * Example: 2026-04-06 -> 06 Apr 26
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });
};

/**
 * Formats a date string to a short month format
 * Example: 2026-04 -> Apr 26
 */
export const formatMonth = (ymString) => {
  if (!ymString) return '';
  const [y, m] = ymString.split('-');
  return new Date(+y, +m - 1).toLocaleString('en-IN', { 
    month: 'short', 
    year: '2-digit' 
  });
};
