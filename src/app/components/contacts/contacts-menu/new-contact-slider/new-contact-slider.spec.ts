import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewContactSlider } from './new-contact-slider';

describe('NewContactSlider', () => {
  let component: NewContactSlider;
  let fixture: ComponentFixture<NewContactSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewContactSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewContactSlider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
