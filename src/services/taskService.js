// src/services/taskService.js
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, orderBy, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

const tasksKey = (userId) => `deadlineai_tasks_${userId}`;
const metricsKey = (userId) => `deadlineai_metrics_${userId}`;

const defaultMetrics = {
  productivityScore: null,
  riskPercentage: null,
  aiInsights: [],
  lastUpdated: null,
};

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const shouldUseFirestore = (userId) => Boolean(userId && userId !== 'guest');

export const fetchActiveTasks = async (userId = 'guest') => {
  const localTasks = readJson(tasksKey(userId), []);
  if (!shouldUseFirestore(userId)) return localTasks;

  try {
    const q = query(collection(db, 'users', userId, 'tasks'), orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    const firestoreTasks = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    if (firestoreTasks.length) {
      writeJson(tasksKey(userId), firestoreTasks);
      return firestoreTasks;
    }

    return localTasks;
  } catch {
    return localTasks;
  }
};

export const subscribeToTasks = (userId = 'guest', callback) => {
  if (!shouldUseFirestore(userId)) {
    callback(readJson(tasksKey(userId), []));
    return () => {};
  }

  const q = query(collection(db, 'users', userId, 'tasks'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    writeJson(tasksKey(userId), tasks);
    callback(tasks);
  });
};

export const fetchStoredMetrics = async (userId = 'guest') => {
  const localMetrics = readJson(metricsKey(userId), defaultMetrics);
  if (!shouldUseFirestore(userId)) return localMetrics;

  try {
    const snap = await getDoc(doc(db, 'users', userId, 'metrics', 'ai'));
    if (!snap.exists()) return localMetrics;

    const firestoreMetrics = { ...defaultMetrics, ...snap.data() };
    writeJson(metricsKey(userId), firestoreMetrics);
    return firestoreMetrics;
  } catch {
    return localMetrics;
  }
};

export const persistTaskCollection = async (userId, tasks) => {
  writeJson(tasksKey(userId), tasks);

  if (!shouldUseFirestore(userId)) return tasks;

  try {
    const batch = writeBatch(db);
    tasks.forEach((task) => {
      batch.set(doc(db, 'users', userId, 'tasks', task.id), task, { merge: true });
    });
    await batch.commit();
  } catch {
    return tasks;
  }

  return tasks;
};

export const persistMetricsDocument = async (userId, metrics) => {
  writeJson(metricsKey(userId), metrics);

  if (!shouldUseFirestore(userId)) return metrics;

  try {
    await setDoc(doc(db, 'users', userId, 'metrics', 'ai'), metrics, { merge: true });
  } catch {
    return metrics;
  }

  return metrics;
};

export const commitNewTaskNode = async (taskData, userId = 'guest') => {
  const tasks = await fetchActiveTasks(userId);
  const newTask = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    ...taskData,
    status: taskData.status || 'To Do',
  };

  const next = [...tasks, newTask];
  writeJson(tasksKey(userId), next);

  if (shouldUseFirestore(userId)) {
    try {
      await setDoc(doc(db, 'users', userId, 'tasks', newTask.id), newTask, { merge: true });
    } catch {}
  }

  return newTask;
};

export const commitBatchTaskNodes = async (taskItems, userId = 'guest') => {
  if (!taskItems.length) return [];

  const tasks = await fetchActiveTasks(userId);
  const now = Date.now();
  const added = taskItems.map((taskData, index) => ({
    id: `${now}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now + index,
    ...taskData,
    status: taskData.status || 'To Do',
  }));

  const next = [...tasks, ...added];
  writeJson(tasksKey(userId), next);

  if (shouldUseFirestore(userId)) {
    try {
      const batch = writeBatch(db);
      added.forEach((task) => {
        batch.set(doc(db, 'users', userId, 'tasks', task.id), task, { merge: true });
      });
      await batch.commit();
    } catch {}
  }

  return added;
};

export const updateTaskStatusNode = async (taskId, status, userId = 'guest') => {
  const tasks = await fetchActiveTasks(userId);
  const next = tasks.map((task) => (task.id === taskId ? { ...task, status } : task));
  writeJson(tasksKey(userId), next);

  if (shouldUseFirestore(userId)) {
    try {
      await updateDoc(doc(db, 'users', userId, 'tasks', taskId), { status });
    } catch {
      try {
        const target = next.find((t) => t.id === taskId);
        if (target) {
          await setDoc(doc(db, 'users', userId, 'tasks', taskId), target, { merge: true });
        }
      } catch {}
    }
  }

  return next;
};

export const deleteTaskNode = async (taskId, userId = 'guest') => {
  const tasks = await fetchActiveTasks(userId);
  const next = tasks.filter((task) => task.id !== taskId);
  writeJson(tasksKey(userId), next);

  if (shouldUseFirestore(userId)) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'tasks', taskId));
    } catch {
      // best effort delete; keep local state consistent regardless
    }
  }

  return next;
};
