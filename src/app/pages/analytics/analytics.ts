import { Component, computed, inject } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { formatMoney, getCategoryLabel } from '../../utils/formatters';

@Component({
  selector: 'app-analytics',
  imports: [],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  private readonly subscriptionService = inject(SubscriptionService);

  categoryTotals = this.subscriptionService.categoryTotals;
  mostExpensiveSubscription = this.subscriptionService.mostExpensiveSubscription;
  billingCycleStats = this.subscriptionService.billingCycleStats;
  highestCategoryTotal = this.subscriptionService.highestCategoryTotal;
  formatMoney = formatMoney;
  getCategoryLabel = getCategoryLabel;

  chartColors = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2', '#64748b'];

  pieSegments = computed(() => {
    const totals = this.categoryTotals();
    const totalSpend = totals.reduce((sum, categoryTotal) => sum + categoryTotal.total, 0);

    if (totalSpend === 0) {
      return [];
    }

    let currentAngle = -90;

    return totals.map((categoryTotal, index) => {
      const percent = categoryTotal.total / totalSpend;
      const angle = percent * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      const color = this.chartColors[index % this.chartColors.length];

      currentAngle = endAngle;

      return {
        category: categoryTotal.category,
        total: categoryTotal.total,
        percent: percent * 100,
        color,
        path: this.createDonutSegmentPath(21, 21, 16, 10, startAngle, endAngle),
      };
    });
  });

  totalCategorySpend = computed(() =>
    this.categoryTotals().reduce((sum, categoryTotal) => sum + categoryTotal.total, 0),
  );

  private createDonutSegmentPath(
    centerX: number,
    centerY: number,
    outerRadius: number,
    innerRadius: number,
    startAngle: number,
    endAngle: number,
  ) {
    const outerStart = this.polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const outerEnd = this.polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const innerStart = this.polarToCartesian(centerX, centerY, innerRadius, startAngle);
    const innerEnd = this.polarToCartesian(centerX, centerY, innerRadius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ');
  }

  private polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }
}
