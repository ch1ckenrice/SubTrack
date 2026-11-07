import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subscription } from '../../models/subscription.model';
import { SubscriptionCard } from './subscription-card';

const subscription: Subscription = {
  id: 'spotify',
  name: 'Spotify',
  price: 10.99,
  currency: 'USD',
  category: 'music',
  billingCycle: 'monthly',
  paidDates: [],
  nextBillingDate: '2026-11-10',
  status: 'active',
  color: '#4f46e5',
};

describe('SubscriptionCard', () => {
  let component: SubscriptionCard;
  let fixture: ComponentFixture<SubscriptionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionCard);
    fixture.componentRef.setInput('subscription', subscription);
    fixture.detectChanges();
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
