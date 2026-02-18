import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInFooter } from './log-in-footer';

describe('LogInFooter', () => {
  let component: LogInFooter;
  let fixture: ComponentFixture<LogInFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogInFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogInFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
