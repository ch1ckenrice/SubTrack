import { Component, computed, inject } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { SubscriptionService } from '../../services/subscription.service';
import { formatDateKey, formatMoney } from '../../utils/formatters';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly settingsService = inject(SettingsService);

  totalSubscriptions = this.subscriptionService.totalSubscriptions;
  monthlyTotal = this.subscriptionService.monthlyTotal;
  yearlyTotal = this.subscriptionService.yearlyTotal;
  upcomingSubscription = this.subscriptionService.upcomingSubscription;
  settings = this.settingsService.getSettings();
  formatDateKey = formatDateKey;
  formatMoney = formatMoney;

  budgetUsagePercent = computed(() => {
    const budget = this.settings().monthlyBudget;

    if (budget === 0) {
      return 0;
    }

    return Math.min((this.monthlyTotal() / budget) * 100, 100);
  });

  budgetStatus = computed(() => {
    const percent = this.budgetUsagePercent();

    if (percent >= 90) {
      return 'High usage';
    }

    if (percent >= 70) {
      return 'Moderate usage';
    }

    return 'Healthy';
  });
}
