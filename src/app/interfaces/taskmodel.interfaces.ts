import { SupabaseContactsInterface } from "./supabase.interfaces";

/**
 * Represents a single subtask within a task.
 */
 export interface Subtask {
  id: number;
  title: string;
  isDone: boolean;
}

/**
 * Represents a task with its details, subtasks, and assignment information.
 */
 export interface Task {
  id: number;
  progressStatus: 'To do' | 'In progress' | 'Await feedback' | 'Done';
  category: string;
  headline: string;
  desc: string;
  dueDate: string;
  priority: number;
  assignedTo: SupabaseContactsInterface[];
  subtasks: Subtask[];
}
