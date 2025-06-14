// Currency conversion utilities
const USD_TO_RWF = 1300; // 1 USD = 1300 RWF (approximate rate)

export const formatCurrency = (amount: number, currency: 'USD' | 'RWF' = 'RWF'): string => {
  const convertedAmount = currency === 'RWF' ? amount * USD_TO_RWF : amount;
  
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedAmount);
};

export const convertToRWF = (usdAmount: number): number => {
  return usdAmount * USD_TO_RWF;
};

export const convertToUSD = (rwfAmount: number): number => {
  return rwfAmount / USD_TO_RWF;
}; 