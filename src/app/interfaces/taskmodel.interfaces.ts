export interface Subtask {
  id: number;
  title: string;
  isDone: boolean;
}

export interface Task {
  id: number;
  progressStatus: 'To do' | 'In progress' | 'Await feedback' | 'Done';
  category: string;
  headline: string;
  desc: string;
  dueDate: string;
  priority: number;
  assignedTo: string[];
  subtasks: Subtask[];
}
