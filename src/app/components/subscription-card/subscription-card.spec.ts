import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionCard } from './subscription-card';

describe('SubscriptionCard', () => {
  let component: SubscriptionCard;
  let fixture: ComponentFixture<SubscriptionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
