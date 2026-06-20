import { User, Task, Column } from './task.model';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Carolina M.', avatarInitials: 'CM', avatarColor: '#f5a623' },
  { id: 'u2', name: 'Alex Rivera', avatarInitials: 'AR', avatarColor: '#4a7cf7' },
  { id: 'u3', name: 'Sam Chen',   avatarInitials: 'SC', avatarColor: '#a855f7' },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1', title: 'Set up NgRx store with Signals',
    description: 'Bootstrap the NgRx Signals store with entity adapter for tasks and columns.',
    status: 'done', priority: 'high', assigneeId: 'u1',
    tags: ['architecture', 'ngrx'], createdAt: '2024-11-01T09:00:00Z', updatedAt: '2024-11-02T11:00:00Z', dueDate: '2024-11-03',
  },
  {
    id: 't2', title: 'Design token system & global styles',
    description: 'Define CSS custom properties for colour, typography, spacing and radius across the app.',
    status: 'done', priority: 'medium', assigneeId: 'u1',
    tags: ['design', 'css'], createdAt: '2024-11-01T10:00:00Z', updatedAt: '2024-11-02T14:00:00Z', dueDate: null,
  },
  {
    id: 't3', title: 'Build Column & Task Card components',
    description: 'Standalone components using the new Angular 21 control-flow syntax (@if / @for / @switch).',
    status: 'in-progress', priority: 'high', assigneeId: 'u2',
    tags: ['angular', 'components'], createdAt: '2024-11-03T08:30:00Z', updatedAt: '2024-11-04T09:00:00Z', dueDate: '2024-11-06',
  },
  {
    id: 't4', title: 'Implement drag & drop (CDK)',
    description: 'Wire up Angular CDK DragDropModule so tasks can be reordered within and across columns.',
    status: 'in-progress', priority: 'high', assigneeId: 'u3',
    tags: ['angular', 'ux', 'cdk'], createdAt: '2024-11-04T08:00:00Z', updatedAt: '2024-11-04T08:00:00Z', dueDate: '2024-11-08',
  },
  {
    id: 't5', title: 'Task detail modal',
    description: 'Full-screen overlay showing task details, inline editing, assignee picker and priority selector.',
    status: 'review', priority: 'medium', assigneeId: 'u1',
    tags: ['ux', 'components'], createdAt: '2024-11-04T10:00:00Z', updatedAt: '2024-11-05T13:00:00Z', dueDate: '2024-11-07',
  },
  {
    id: 't6', title: 'Filter & search bar',
    description: 'Add real-time filtering by priority, assignee and keyword using Signals computed().',
    status: 'review', priority: 'low', assigneeId: 'u2',
    tags: ['ux', 'signals'], createdAt: '2024-11-05T09:00:00Z', updatedAt: '2024-11-05T09:00:00Z', dueDate: null,
  },
  {
    id: 't7', title: 'Stats bar — task counters',
    description: 'Summary row at the top showing total, in-progress, and done counts via computed Signals.',
    status: 'todo', priority: 'low', assigneeId: null,
    tags: ['signals', 'dashboard'], createdAt: '2024-11-05T11:00:00Z', updatedAt: '2024-11-05T11:00:00Z', dueDate: null,
  },
  {
    id: 't8', title: 'REST API integration (mock + real)',
    description: 'Wire up HttpClient to a mock JSON server, then replace with real API. Includes effects for async actions.',
    status: 'todo', priority: 'high', assigneeId: 'u3',
    tags: ['api', 'ngrx', 'effects'], createdAt: '2024-11-06T08:00:00Z', updatedAt: '2024-11-06T08:00:00Z', dueDate: '2024-11-10',
  },
  {
    id: 't9', title: 'Unit tests for store & selectors',
    description: 'Jasmine/Karma tests targeting selectors, reducers, and NgRx effects. Aim for 80%+ coverage.',
    status: 'todo', priority: 'medium', assigneeId: null,
    tags: ['testing', 'ngrx'], createdAt: '2024-11-06T09:00:00Z', updatedAt: '2024-11-06T09:00:00Z', dueDate: '2024-11-12',
  },
];

export const INITIAL_COLUMNS: Column[] = [
  { id: 'todo',        label: 'To Do',       colorVar: '--status-todo',   taskIds: ['t7', 't8', 't9'] },
  { id: 'in-progress', label: 'In Progress', colorVar: '--status-doing',  taskIds: ['t3', 't4'] },
  { id: 'review',      label: 'In Review',   colorVar: '--status-review', taskIds: ['t5', 't6'] },
  { id: 'done',        label: 'Done',        colorVar: '--status-done',   taskIds: ['t1', 't2'] },
];
