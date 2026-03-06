import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidBtn } from './mid-btn';

describe('MidBtn', () => {
  let component: MidBtn;
  let fixture: ComponentFixture<MidBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MidBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidBtn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
