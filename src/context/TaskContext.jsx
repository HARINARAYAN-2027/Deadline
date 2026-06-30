// src/context/TaskContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  commitBatchTaskNodes,
  commitNewTaskNode,
  deleteTaskNode,
  fetchStoredMetrics,
  persistMetricsDocument,
  subscribeToTasks,
  updateTaskStatusNode,
} from '../services/taskService';

const TaskContext = createContext(null);

const normalizeTodayTask = (item) => {
  if (typeof item === 'string') {
    return { name: item, deadline: 'Today', priority: 'Medium', source: 'ai-planner' };
  }

  return {
    name: item.task || item.name || 'Untitled task',
    deadline: item.time ? `Today, ${item.time}` : 'Today',
    priority: item.priority || 'Medium',
    scheduledTime: item.time || null,
    source: 'ai-planner',
  };
};

const normalizeDeadlineTask = (item) => {
  if (typeof item === 'string') {
    return { name: item, deadline: item, priority: 'High', source: 'ai-deadline' };
  }

  const deadlineLabel = [item.date, item.month, item.time].filter(Boolean).join(' ');

  return {
    name: item.title || item.name || 'Untitled deadline',
    deadline: deadlineLabel || 'Upcoming',
    priority: item.priority || 'High',
    source: 'ai-deadline',
  };
};

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.uid || 'guest';

  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({
    productivityScore: null,
    riskPercentage: null,
    aiInsights: [],
    lastUpdated: null,
  });
  const [loading, setLoading] = useState(true);

  const hydrateSession = useCallback(async () => {
    setLoading(true);
    try {
      const storedMetrics = await fetchStoredMetrics(userId);
      setMetrics(storedMetrics);
    } catch (err) {
      console.error('Metrics hydrate failed:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToTasks(userId, (liveTasks) => {
      setTasks(liveTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addTask = useCallback(
    async (taskPayload) => {
      try {
        const addedNode = await commitNewTaskNode(taskPayload, userId);
        return { success: true, payload: addedNode };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [userId]
  );

  const toggleStatus = useCallback(
    async (taskId) => {
      const target = tasks.find((task) => task.id === taskId);
      if (!target) return;

      const nextStatus = target.status === 'Done' ? 'To Do' : 'Done';
      await updateTaskStatusNode(taskId, nextStatus, userId);
    },
    [tasks, userId]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      await deleteTaskNode(taskId, userId);
      return { success: true };
    },
    [userId]
  );

  const ingestAiPayload = useCallback(
    async (payload) => {
      if (!payload) {
        return { success: false, error: 'Empty AI payload.' };
      }

      const todayItems = (payload.todayTasks || []).map(normalizeTodayTask);
      const deadlineItems = (payload.upcomingDeadlines || []).map(normalizeDeadlineTask);
      const taskBatch = [...todayItems, ...deadlineItems];

      let addedTasks = [];
      if (taskBatch.length) {
        addedTasks = await commitBatchTaskNodes(taskBatch, userId);
        setTasks((prev) => [...prev, ...addedTasks]);
      }

      const nextMetrics = {
        productivityScore:
          payload.productivityScore === undefined || payload.productivityScore === null
            ? null
            : Number(payload.productivityScore),
        riskPercentage:
          payload.riskPercentage === undefined || payload.riskPercentage === null
            ? null
            : Number(payload.riskPercentage),
        aiInsights: Array.isArray(payload.aiInsights) ? payload.aiInsights : [],
        lastUpdated: new Date().toISOString(),
      };

      await persistMetricsDocument(userId, nextMetrics);
      setMetrics(nextMetrics);

      return {
        success: true,
        tasksAdded: addedTasks.length,
        metrics: nextMetrics,
      };
    },
    [userId]
  );

  const value = useMemo(
    () => ({
      tasks,
      metrics,
      loading,
      addTask,
      toggleStatus,
      deleteTask,
      ingestAiPayload,
      refreshTasks: hydrateSession,
    }),
    [tasks, metrics, loading, addTask, toggleStatus, deleteTask, ingestAiPayload, hydrateSession]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
};

export { TaskContext };
