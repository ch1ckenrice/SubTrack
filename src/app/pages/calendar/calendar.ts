import { Component, computed, inject, signal } from '@angular/core';
import { Subscription } from '../../models/subscription.model';
import { SettingsService } from '../../services/settings.service';
import { SubscriptionService } from '../../services/subscription.service';
import { formatDateKey, formatMoney, getCategoryLabel, toDateKey } from '../../utils/formatters';

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly settingsService = inject(SettingsService);

  settings = this.settingsService.getSettings();
  upcomingSubscriptions = this.subscriptionService.upcomingSubscriptions;
  selectDate = signal(new Date());
  selectedDateKey = signal<string | null>(null);
  formatDateKey = formatDateKey;
  formatMoney = formatMoney;
  getCategoryLabel = getCategoryLabel;

  monthLabel = computed(() =>
    this.selectDate().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
  );

  monthDays = computed(() => {
    const date = this.selectDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startOffset = this.getMondayStartOffset(firstDayOfMonth);

    const emptyDays = Array.from({ length: startOffset }, (_, index) => ({
      id: `empty-${index}`,
      day: null,
      dateKey: null,
    }));

    const days = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = new Date(year, month, day);
      const dateKey = toDateKey(date);

      return {
        id: dateKey,
        day,
        dateKey,
      };
    });

    return [...emptyDays, ...days];
  });

  selectedDateSubscriptions = computed(() => {
    const selectedDateKey = this.selectedDateKey();

    if (!selectedDateKey) {
      return [];
    }

    return this.getSubscriptionsForDate(selectedDateKey);
  });

  isDueSoon(date: string) {
    const today = new Date();
    const billingDate = new Date(date);
    const differenceInMs = billingDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

    return differenceInDays >= 0 && differenceInDays <= this.settings().reminderDays;
  }

  getSubscriptionsForDate(dateKey: string) {
    return this.upcomingSubscriptions().filter(
      (subscription) =>
        subscription.paidDates.includes(dateKey) ||
        this.isSubscriptionScheduledForDate(subscription, dateKey),
    );
  }

  hasPaidPayment(dateKey: string) {
    return this.getSubscriptionsForDate(dateKey).some((subscription) =>
      subscription.paidDates.includes(dateKey),
    );
  }

  selectCalendarDate(dateKey: string | null) {
    this.selectedDateKey.set(dateKey);
  }

  goToPreviousMonth() {
    const date = this.selectDate();

    this.selectDate.set(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  }

  goToNextMonth() {
    const date = this.selectDate();

    this.selectDate.set(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }

  private isSubscriptionScheduledForDate(subscription: Subscription, dateKey: string) {
    if (dateKey < subscription.nextBillingDate) {
      return false;
    }

    const calendarDate = new Date(dateKey);
    const subscriptionDate = new Date(subscription.nextBillingDate);

    if (subscription.billingCycle === 'yearly') {
      const sameDay = calendarDate.getDate() === subscriptionDate.getDate();
      const sameMonth = calendarDate.getMonth() === subscriptionDate.getMonth();

      return sameDay && sameMonth;
    }

    const expectedPaymentDay = this.getPaymentDayForMonth(
      subscriptionDate.getDate(),
      calendarDate.getMonth(),
      calendarDate.getFullYear(),
    );

    return calendarDate.getDate() === expectedPaymentDay;
  }

  private getPaymentDayForMonth(originalPaymentDay: number, month: number, year: number) {
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    return Math.min(originalPaymentDay, lastDayOfMonth);
  }

  private getMondayStartOffset(date: Date) {
    const day = date.getDay();

    return day === 0 ? 6 : day - 1;
  }
}
