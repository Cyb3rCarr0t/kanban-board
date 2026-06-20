// ============================================================
// CORE DOMAIN MODELS
// All types used across the application live here.
// ============================================================

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  avatarInitials: string;
  avatarColor: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  tags: string[];
  createdAt: string;   // ISO date string
  updatedAt: string;
  dueDate: string | null;
}

export interface Column {
  id: TaskStatus;
  label: string;
  colorVar: string;   // CSS variable name e.g. '--status-todo'
  taskIds: string[];  // ordered list
}

export interface BoardState {
  tasks: Record<string, Task>;
  columns: Column[];
  users: User[];
  selectedTaskId: string | null;
  isModalOpen: boolean;
  filterPriority: TaskPriority | null;
  filterAssigneeId: string | null;
  searchQuery: string;
}

// DTO for creating / updating a task (omits computed fields)
export type CreateTaskDto = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskDto = Partial<Omit<Task, 'id' | 'createdAt'>> & { updatedAt?: string };
