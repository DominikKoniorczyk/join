export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 0 | 1 | 2;
  category: string;
  assignedTo: number[];
  subtasks: string[];
  status: 'todo' | 'in-progress' | 'done';
}
