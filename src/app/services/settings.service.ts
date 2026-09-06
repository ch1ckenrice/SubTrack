import { Injectable, signal } from '@angular/core';
import { AppSettings } from '../models/app-settings.model';

const SETTINGS_STORAGE_KEY = 'subtrack_settings';

const DEFAULT_SETTINGS: AppSettings = {
  monthlyBudget: 100,
  currency: 'USD',
  reminderDays: 7,
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly settings = signal<AppSettings>(this.loadSettings());

  getSettings() {
    return this.settings.asReadonly();
  }

  updateMonthlyBudget(monthlyBudget: number) {
    this.settings.update((settings) => {
      const updatedSettings = {
        ...settings,
        monthlyBudget,
      };

      this.saveSettings(updatedSettings);

      return updatedSettings;
    });
  }

  updateReminderDays(reminderDays: number) {
    this.settings.update((settings) => {
      const updatedSettings = {
        ...settings,
        reminderDays,
      };

      this.saveSettings(updatedSettings);

      return updatedSettings;
    });
  }

  resetSettings() {
    this.settings.set(DEFAULT_SETTINGS);
    this.saveSettings(DEFAULT_SETTINGS);
  }

  private loadSettings(): AppSettings {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!savedSettings) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...(JSON.parse(savedSettings) as Partial<AppSettings>),
    };
  }

  private saveSettings(settings: AppSettings) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }
}
