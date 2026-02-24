import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskBtn } from './add-task-btn';

describe('AddTaskBtn', () => {
  let component: AddTaskBtn;
  let fixture: ComponentFixture<AddTaskBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskBtn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
