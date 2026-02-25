export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: number;
  category: string;
  assignedTo: number[];
  subtasks: string[];
  status: 'todo' | 'in-progress' | 'done';
}
