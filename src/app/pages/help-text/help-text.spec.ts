import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpText } from './help-text';

describe('HelpText', () => {
  let component: HelpText;
  let fixture: ComponentFixture<HelpText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
