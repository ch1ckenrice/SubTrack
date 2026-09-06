export type BillingCycle = 'monthly' | 'yearly';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export type SubscriptionCategory =
  'entertainment' | 'music' | 'education' | 'productivity' | 'cloud' | 'design' | 'other';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: 'USD';
  category: SubscriptionCategory;
  billingCycle: BillingCycle;
  paidDates: string[];
  nextBillingDate: string;
  status: SubscriptionStatus;
  color: string;
}
