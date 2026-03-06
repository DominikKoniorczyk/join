import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBtn } from './top-btn';

describe('TopBtn', () => {
  let component: TopBtn;
  let fixture: ComponentFixture<TopBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopBtn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
