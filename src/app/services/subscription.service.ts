import { computed, Injectable, signal } from '@angular/core';
import { Subscription, SubscriptionCategory } from '../models/subscription.model';
import { toDateKey } from '../utils/formatters';

const STORAGE_KEY = 'subtrack_subscriptions';
const INITIAL_SUBSCRIPTIONS: Subscription[] = [];

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private readonly subscriptions = signal<Subscription[]>(this.loadSubscriptions());

  getSubscriptions() {
    return this.subscriptions.asReadonly();
  }

  addSubscription(subscription: Subscription) {
    this.subscriptions.update((subscriptions) => {
      const normalizedSubscription = this.normalizeSubscriptionDate(subscription);
      const updatedSubscriptions = [...subscriptions, normalizedSubscription];

      this.saveSubscriptions(updatedSubscriptions);

      return updatedSubscriptions;
    });
  }

  updateSubscription(updatedSubscription: Subscription) {
    this.subscriptions.update((subscriptions) => {
      const normalizedSubscription = this.normalizeSubscriptionDate(updatedSubscription);
      const updatedSubscriptions = subscriptions.map((subscription) =>
        subscription.id === updatedSubscription.id ? normalizedSubscription : subscription,
      );

      this.saveSubscriptions(updatedSubscriptions);

      return updatedSubscriptions;
    });
  }

  deleteSubscription(id: string) {
    this.subscriptions.update((subscriptions) => {
      const updatedSubscriptions = subscriptions.filter((subscription) => subscription.id !== id);

      this.saveSubscriptions(updatedSubscriptions);

      return updatedSubscriptions;
    });
  }

  resetSubscriptions() {
    this.subscriptions.set([]);
    this.saveSubscriptions([]);
  }

  totalSubscriptions = computed(() => this.subscriptions().length);

  monthlyTotal = computed(() =>
    this.subscriptions().reduce((total, subscription) => {
      if (subscription.billingCycle === 'yearly') {
        return total + subscription.price / 12;
      }

      return total + subscription.price;
    }, 0),
  );

  yearlyTotal = computed(() => this.monthlyTotal() * 12);

  upcomingSubscription = computed(() => {
    const activeSubscription = this.subscriptions()
      .filter((subscription) => subscription.status === 'active')
      .sort(
        (firstSubscription, secondSubscription) =>
          new Date(firstSubscription.nextBillingDate).getTime() -
          new Date(secondSubscription.nextBillingDate).getTime(),
      );
    return activeSubscription[0] ?? null;
  });

  upcomingSubscriptions = computed(() =>
    [...this.subscriptions()]
      .filter((subscription) => subscription.status === 'active')
      .sort(
        (firstSubscription, secondSubscription) =>
          new Date(firstSubscription.nextBillingDate).getTime() -
          new Date(secondSubscription.nextBillingDate).getTime(),
      ),
  );

  categoryTotals = computed(() => {
    const totals = new Map<SubscriptionCategory, number>();

    this.subscriptions().forEach((subscription) => {
      const monthlyPrice =
        subscription.billingCycle === 'yearly' ? subscription.price / 12 : subscription.price;

      const currentTotal = totals.get(subscription.category) ?? 0;

      totals.set(subscription.category, currentTotal + monthlyPrice);
    });

    return Array.from(totals.entries()).map(([category, total]) => ({
      category,
      total,
    }));
  });

  mostExpensiveSubscription = computed(() => {
    const subscriptions = this.subscriptions();

    if (subscriptions.length === 0) {
      return null;
    }

    return subscriptions.reduce((mostExpensive, subscription) =>
      subscription.price > mostExpensive.price ? subscription : mostExpensive,
    );
  });

  billingCycleStats = computed(() => {
    const monthlyCount = this.subscriptions().filter(
      (subscription) => subscription.billingCycle === 'monthly',
    ).length;

    const yearlyCount = this.subscriptions().filter(
      (subscription) => subscription.billingCycle === 'yearly',
    ).length;

    return {
      monthlyCount,
      yearlyCount,
    };
  });

  highestCategoryTotal = computed(() => {
    const totals = this.categoryTotals();

    if (totals.length === 0) {
      return 0;
    }

    return Math.max(...totals.map((categoryTotal) => categoryTotal.total));
  });

  private loadSubscriptions(): Subscription[] {
    const savedSubscriptions = localStorage.getItem(STORAGE_KEY);

    if (!savedSubscriptions) {
      return INITIAL_SUBSCRIPTIONS.map((subscription) =>
        this.normalizeSubscriptionDate(subscription),
      );
    }

    const subscriptions = JSON.parse(savedSubscriptions) as Subscription[];
    const normalizedSubscriptions = subscriptions.map((subscription) =>
      this.normalizeSubscriptionDate(subscription),
    );

    this.saveSubscriptions(normalizedSubscriptions);

    return normalizedSubscriptions;
  }

  private saveSubscriptions(subscriptions: Subscription[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  }

  private getTodayKey() {
    const today = new Date();

    return toDateKey(today);
  }

  private addBillingCycle(date: Date, billingCycle: Subscription['billingCycle']) {
    if (billingCycle === 'monthly') {
      return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    return new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
  }

  private normalizeSubscriptionDate(subscription: Subscription): Subscription {
    let billingDate = new Date(subscription.nextBillingDate);
    const todayDateKey = this.getTodayKey();
    const paidDates = [...(subscription.paidDates ?? [])];

    while (toDateKey(billingDate) < todayDateKey) {
      const paidDateKey = toDateKey(billingDate);

      if (!paidDates.includes(paidDateKey)) {
        paidDates.push(paidDateKey);
      }

      billingDate = this.addBillingCycle(billingDate, subscription.billingCycle);
    }

    return {
      ...subscription,
      paidDates,
      nextBillingDate: toDateKey(billingDate),
    };
  }
}
