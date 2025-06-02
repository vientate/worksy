// data/mockData.js
export const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Task 1', createdBy: 'user-1' },
    'task-2': { id: 'task-2', content: 'Task 2', createdBy: 'user-1' },
    'task-3': { id: 'task-3', content: 'Task 3', createdBy: 'user-2' },
    'task-4': { id: 'task-4', content: 'Task 4', createdBy: 'user-2' },
    'task-5': { id: 'task-5', content: 'Task 5', createdBy: 'user-1' },
  },
  columns: {
    'column-1': { id: 'column-1', title: 'To Do', taskIds: ['task-1', 'task-2'] },
    'column-2': { id: 'column-2', title: 'In Progress', taskIds: ['task-3'] },
    'column-3': { id: 'column-3', title: 'Done', taskIds: ['task-4', 'task-5'] },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
  users: {
    'user-1': { id: 'user-1', name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    'user-2': { id: 'user-2', name: 'Member', email: 'member@example.com', password: 'member123', role: 'member' },
  },
};