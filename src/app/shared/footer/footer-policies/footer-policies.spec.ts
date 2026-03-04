import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPolicies } from './footer-policies';

describe('FooterPolicies', () => {
  let component: FooterPolicies;
  let fixture: ComponentFixture<FooterPolicies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterPolicies]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FooterPolicies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
