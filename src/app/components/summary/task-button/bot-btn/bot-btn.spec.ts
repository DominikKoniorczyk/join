import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotBtn } from './bot-btn';

describe('BotBtn', () => {
  let component: BotBtn;
  let fixture: ComponentFixture<BotBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotBtn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
