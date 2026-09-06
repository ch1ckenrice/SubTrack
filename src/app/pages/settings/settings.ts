import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private readonly settingsService = inject(SettingsService);
  private readonly subscriptionService = inject(SubscriptionService);

  settings = this.settingsService.getSettings();

  settingsForm = new FormGroup({
    monthlyBudget: new FormControl(this.settings().monthlyBudget, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    reminderDays: new FormControl(this.settings().reminderDays, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  onSubmit() {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    const formValue = this.settingsForm.getRawValue();

    this.settingsService.updateMonthlyBudget(formValue.monthlyBudget);
    this.settingsService.updateReminderDays(formValue.reminderDays);
  }

  isInvalid(controlName: keyof typeof this.settingsForm.controls) {
    const control = this.settingsForm.controls[controlName];

    return control.invalid && control.touched;
  }

  resetLocalData() {
    const shouldReset = confirm('Reset all subscriptions and settings?');

    if (!shouldReset) {
      return;
    }

    this.subscriptionService.resetSubscriptions();
    this.settingsService.resetSettings();

    this.settingsForm.reset({
      monthlyBudget: this.settings().monthlyBudget,
      reminderDays: this.settings().reminderDays,
    });
  }
}
