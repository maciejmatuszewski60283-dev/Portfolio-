export const projectStatuses = {
  completed: 'Zrealizowany',
  'in-progress': 'W realizacji',
  concept: 'Koncepcja',
} as const;

export type ProjectStatus = keyof typeof projectStatuses;

export const projectStatusKeys = Object.keys(projectStatuses) as [
  ProjectStatus,
  ...ProjectStatus[],
];
