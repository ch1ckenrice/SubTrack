import { Component, input, output } from '@angular/core';
import { Subscription } from '../../models/subscription.model';
import { formatMoney, getBillingCycleLabel, getCategoryLabel } from '../../utils/formatters';

@Component({
  selector: 'app-subscription-card',
  imports: [],
  templateUrl: './subscription-card.html',
  styleUrl: './subscription-card.scss',
})
export class SubscriptionCard {
  subscription = input.required<Subscription>();

  edit = output<Subscription>();
  delete = output<string>();
  formatMoney = formatMoney;
  getBillingCycleLabel = getBillingCycleLabel;
  getCategoryLabel = getCategoryLabel;

  onEdit() {
    this.edit.emit(this.subscription());
  }

  onDelete() {
    this.delete.emit(this.subscription().id);
  }
}
