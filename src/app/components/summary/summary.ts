import { Component, computed} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskButtonComponent } from './task-button/task-button';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [RouterModule, TaskButtonComponent],
  templateUrl: './summary.html',
  styleUrls: ['./summary.scss']
})
export class Summary  {


userName: string = 'Guest';

greetingText = computed(()=> {
  const hour = new Date().getHours();
  if(hour < 12) return 'Good morning';
  if(hour< 18) return 'Good afternoon';
  return 'Good evening';
});

}
