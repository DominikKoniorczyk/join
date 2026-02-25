export interface Subtask {
  id: number;
  title: string;
  isDone: boolean;
}

export interface Task {
  id: number;
  category: 'User Story' | 'Technical Task';
  headline: string;
  desc: string;
  dueDate: string;
  priority: 1 | 2 | 3;
  assignedTo: string[];
  subtasks: Subtask[];
}
