// src/utils/helper.js

// Dynamic percentages calculations safe wrapper module
export const calculateEfficiencyRate = (completed, total) => {
  if (!total || total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// Array filter selectors matching priority keys strings
export const groupTasksByPriority = (tasksList = []) => {
  return tasksList.reduce((acc, currentTask) => {
    const priority = currentTask.priority || 'Medium';
    if (!acc[priority]) acc[priority] = [];
    acc[priority].push(currentTask);
    return acc;
  }, { High: [], Medium: [], Low: [] });
};

// Quick random seeding generators for background operations logs
export const generateUniqueNodeId = () => {
  return `node_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
};