import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardCards } from './board-cards';

describe('BoardCards', () => {
  let component: BoardCards;
  let fixture: ComponentFixture<BoardCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
