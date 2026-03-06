import { Component } from '@angular/core';
import { TopBtn } from './top-btn/top-btn';
import { MidBtn } from './mid-btn/mid-btn';
import { BotBtn } from './bot-btn/bot-btn';
@Component({
  selector: 'app-task-button',
  standalone: true,
  imports: [TopBtn, MidBtn, BotBtn],
  templateUrl: './task-button.html',
  styleUrls: ['./task-button.scss']
})
export class TaskButtonComponent  {

}
