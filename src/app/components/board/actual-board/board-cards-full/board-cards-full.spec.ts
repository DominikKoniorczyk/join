import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardCardsFull } from './board-cards-full';

describe('BoardCardsFull', () => {
  let component: BoardCardsFull;
  let fixture: ComponentFixture<BoardCardsFull>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardCardsFull]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardCardsFull);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
