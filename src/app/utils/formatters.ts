import { BillingCycle, SubscriptionCategory } from '../models/subscription.model';

const CATEGORY_LABELS: Record<SubscriptionCategory, string> = {
  entertainment: 'Entertainment',
  music: 'Music',
  education: 'Education',
  productivity: 'Productivity',
  cloud: 'Cloud',
  design: 'Design',
  other: 'Other',
};

const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export function formatMoney(amount: number, currency = 'USD') {
  return `${amount.toFixed(2)} ${currency}`;
}

export function getCategoryLabel(category: SubscriptionCategory) {
  return CATEGORY_LABELS[category];
}

export function getBillingCycleLabel(billingCycle: BillingCycle) {
  return BILLING_CYCLE_LABELS[billingCycle];
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
    ? date
    : null;
}

export function formatDateKey(dateKey: string) {
  const date = parseDateKey(dateKey);

  if (!date) {
    return dateKey;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
