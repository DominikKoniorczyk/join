export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'urgent' | 'medium' | 'low';
  category: string;
  assignedTo: number[]; // 🔥 wichtig: IDs von Contacts!
  subtasks: string[];
  status: 'todo' | 'in-progress' | 'done';
}