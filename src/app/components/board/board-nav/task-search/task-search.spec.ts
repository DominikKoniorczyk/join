import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSearch } from './task-search';

describe('TaskSearch', () => {
  let component: TaskSearch;
  let fixture: ComponentFixture<TaskSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
