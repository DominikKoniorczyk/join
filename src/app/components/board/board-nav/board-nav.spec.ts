import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardNav } from './board-nav';

describe('BoardNav', () => {
  let component: BoardNav;
  let fixture: ComponentFixture<BoardNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardNav]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BoardNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
