import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, SubscriptionCategory } from '../../models/subscription.model';
import { SubscriptionCard } from '../../components/subscription-card/subscription-card';
import { SubscriptionService } from '../../services/subscription.service';
import { formatMoney } from '../../utils/formatters';

@Component({
  selector: 'app-subscriptions',
  imports: [ReactiveFormsModule, SubscriptionCard],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.scss',
})
export class Subscriptions {
  private readonly subscriptionService = inject(SubscriptionService);

  subscriptions = this.subscriptionService.getSubscriptions();
  totalSubscriptions = this.subscriptionService.totalSubscriptions;
  monthlyTotal = this.subscriptionService.monthlyTotal;
  yearlyTotal = this.subscriptionService.yearlyTotal;
  formatMoney = formatMoney;

  editingSubscriptionId: string | null = null;
  editingSubscription: Subscription | null = null;

  searchTerm = signal('');
  selectedCategory = signal<'all' | SubscriptionCategory>('all');
  selectedBillingCycle = signal<'all' | 'monthly' | 'yearly'>('all');

  subscriptionForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    currency: new FormControl<'USD'>('USD', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category: new FormControl<SubscriptionCategory>('entertainment', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    billingCycle: new FormControl<'monthly' | 'yearly'>('monthly', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    nextBillingDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  filteredSubscriptions = computed(() => {
    const searchTerm = this.searchTerm().trim().toLowerCase();
    const selectedCategory = this.selectedCategory();
    const selectedBillingCycle = this.selectedBillingCycle();

    return this.subscriptions().filter((subscription) => {
      const matchesSearch = subscription.name.toLowerCase().includes(searchTerm);
      const matchesCategory =
        selectedCategory === 'all' || subscription.category === selectedCategory;
      const matchesBillingCycle =
        selectedBillingCycle === 'all' || subscription.billingCycle === selectedBillingCycle;

      return matchesSearch && matchesCategory && matchesBillingCycle;
    });
  });

  onSubmit() {
    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }

    const formValue = this.subscriptionForm.getRawValue();

    const subscriptionPayload: Subscription = {
      id: this.editingSubscriptionId ?? crypto.randomUUID(),
      name: formValue.name,
      price: formValue.price,
      currency: formValue.currency,
      category: formValue.category,
      billingCycle: formValue.billingCycle,
      paidDates: this.editingSubscription?.paidDates ?? [],
      nextBillingDate: formValue.nextBillingDate,
      status: 'active',
      color: '#4f46e5',
    };

    if (this.editingSubscriptionId) {
      this.subscriptionService.updateSubscription(subscriptionPayload);
    } else {
      this.subscriptionService.addSubscription(subscriptionPayload);
    }

    this.editingSubscriptionId = null;

    this.subscriptionForm.reset({
      name: '',
      price: 0,
      currency: 'USD',
      category: 'entertainment',
      billingCycle: 'monthly',
      nextBillingDate: '',
    });
    this.editingSubscription = null;
  }

  isInvalid(controlName: keyof typeof this.subscriptionForm.controls) {
    const control = this.subscriptionForm.controls[controlName];

    return control.invalid && control.touched;
  }

  onEditSubscription(subscription: Subscription) {
    this.editingSubscriptionId = subscription.id;
    this.editingSubscription = subscription;

    this.subscriptionForm.setValue({
      name: subscription.name,
      price: subscription.price,
      currency: subscription.currency,
      category: subscription.category,
      billingCycle: subscription.billingCycle,
      nextBillingDate: subscription.nextBillingDate,
    });
  }

  onDeleteSubscription(id: string) {
    this.subscriptionService.deleteSubscription(id);
  }

  cancelEdit() {
    this.editingSubscriptionId = null;

    this.subscriptionForm.reset({
      name: '',
      price: 0,
      currency: 'USD',
      category: 'entertainment',
      billingCycle: 'monthly',
      nextBillingDate: '',
    });

    this.editingSubscription = null;
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
  }

  onCategoryChange(event: Event) {
    const select = event.target as HTMLSelectElement;

    this.selectedCategory.set(select.value as 'all' | SubscriptionCategory);
  }

  onBillingCycleChange(event: Event) {
    const select = event.target as HTMLSelectElement;

    this.selectedBillingCycle.set(select.value as 'all' | 'monthly' | 'yearly');
  }
}
