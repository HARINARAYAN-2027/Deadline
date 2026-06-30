import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Plus, Trash2, AlertTriangle, Clock } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { notificationService } from '../../services/notificationService';

const ACTION_REQUIRED_TEXT =
  'Action Required: You missed your deadline! Please submit your task now.';

const parseScheduledTimeToMinutes = (scheduledTime) => {
  if (!scheduledTime || typeof scheduledTime !== 'string') return null;
  const raw = scheduledTime.trim();
  const match = raw.match(/^\s*(\d{1,2})\s*:\s*(\d{2})\s*(AM|PM)\s*$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const modifier = match[3].toUpperCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (minutes < 0 || minutes > 59) return null;

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const minutesSinceMidnight = (d) => d.getHours() * 60 + d.getMinutes();

const normalizeTaskName = (s) => (s || '').trim().replace(/\s+/g, ' ');

const Tasks = () => {
  const { tasks: serverTasks = [], loading, addTask, deleteTask, toggleStatus } = useTasks();

  const [activeTab, setActiveTab] = useState('All');
  const [textInput, setTextInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState('Medium');
  const [submitting, setSubmitting] = useState(false);
  const [processingTaskId, setProcessingTaskId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('tasks');
    let savedTasks = [];

    if (saved) {
      try {
        savedTasks = JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse tasks from sessionStorage:', err);
      }
    }

    const savedById = new Map(
      savedTasks.map((task) => [task.id || normalizeTaskName(task.name || task.title), task])
    );

    const mergedTasks = (serverTasks || []).map((task) => {
      const key = task.id || normalizeTaskName(task.name || task.title);
      const savedTask = savedById.get(key);
      return savedTask ? { ...task, status: savedTask.status ?? task.status } : task;
    });

    const extraSavedTasks = savedTasks.filter((savedTask) => {
      const key = savedTask.id || normalizeTaskName(savedTask.name || savedTask.title);
      return !mergedTasks.some((task) => (task.id && task.id === savedTask.id) || normalizeTaskName(task.name || task.title) === key);
    });

    setTasks([...mergedTasks, ...extraSavedTasks]);
  }, [serverTasks]);

  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const lastUrgentAlertAtRef = useRef(new Map());

  const overdueHighPriorityCount = useMemo(() => {
    const now = Date.now();
    return tasks.filter((task) => {
      if (task.status === 'Done' || task.priority !== 'High') return false;
      const deadline = new Date(task.deadline || task.scheduledTime || '');
      return !Number.isNaN(deadline.getTime()) && deadline.getTime() <= now;
    }).length;
  }, [tasks]);

  const triggerUrgentReNotification = async (task) => {
    setAlertMessage(ACTION_REQUIRED_TEXT);
    try {
      notificationService?.sendSystemNotification?.('Overdue!', {
        body: ACTION_REQUIRED_TEXT,
        tag: `overdue-${task?.id || 'task'}`,
        requireInteraction: true,
      });
    } catch (err) {
      // ignore notification failures
    }
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const current = new Date();
      const now = Date.now();
      const nowMinutes = minutesSinceMidnight(current);

      const currentTasks = tasksRef.current || [];
      for (const task of currentTasks) {
        const isDone = task?.status === 'Done';
        if (isDone) continue;

        const scheduledTimeStr = task?.scheduledTime ?? task?.scheduled_time;
        const scheduledMinutes = parseScheduledTimeToMinutes(scheduledTimeStr);
        if (scheduledMinutes === null) continue;

        const minutesRemaining = scheduledMinutes - nowMinutes;
        const lastAt = lastUrgentAlertAtRef.current.get(task.id) || 0;
        const elapsed = now - lastAt;

        const shouldAlertBefore = minutesRemaining <= 5 && minutesRemaining >= 0;
        const shouldAlertAfter = minutesRemaining < 0;

        if ((shouldAlertBefore || shouldAlertAfter) && elapsed >= 5 * 60 * 1000) {
          lastUrgentAlertAtRef.current.set(task.id, now);
          triggerUrgentReNotification(task);
        }
      }
    }, 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const toggleTaskComplete = async (taskId) => {
    setAlertMessage(null);

    const item = tasksRef.current.find((t) => t.id === taskId);
    if (!item) return;
    if (item.status === 'Done') return;

    setProcessingTaskId(taskId);
    try {
      await toggleStatus(taskId);
    } catch (err) {
      console.error('Error toggling task status:', err);
    }

    lastUrgentAlertAtRef.current.delete(taskId);
    setProcessingTaskId(null);
  };

  const handleAddTask = async (e) => {
    if (e) e.preventDefault();
    const inputValue = textInput.trim();

    if (inputValue.toLowerCase().endsWith('done')) {
      const commandKeyword = inputValue.replace(/done$/i, '').trim().toLowerCase();

      if (commandKeyword) {
        const matchingTask = tasks.find((t) =>
          (t.title || t.name || '').toLowerCase().includes(commandKeyword)
        );
        if (matchingTask && matchingTask.status !== 'Done') {
          setProcessingTaskId(matchingTask.id);
          try {
            await toggleStatus(matchingTask.id);
          } catch (err) {
            console.error('Error marking task as done:', err);
          }
          setProcessingTaskId(null);
        }
      }

      setTextInput('');
      return;
    }

    if (!inputValue || submitting) return;

    setSubmitting(true);
    try {
      const result = await addTask({
        name: inputValue,
        deadline: '',
        priority,
        status: 'To Do',
        scheduledTime: '',
      });

      if (result?.success) {
        if (result.payload) {
          setTasks((prevTasks) => [
            {
              ...result.payload,
              name: inputValue,
              deadline: '',
              priority,
              status: 'To Do',
              scheduledTime: '',
            },
            ...prevTasks,
          ]);
        }
        setTextInput('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputSubmit = async (e) => {
    await handleAddTask(e);
  };

  const handlePermanentDelete = async (taskId) => {
    setProcessingTaskId(taskId);
    await deleteTask(taskId);
    lastUrgentAlertAtRef.current.delete(taskId);
    setProcessingTaskId(null);
  };

  const filteredTasks = useMemo(() => {
    const unique = Array.from(new Map(tasks.map((t) => [t.id, t])).values());

    return unique.filter((task) => {
      if (activeTab === 'To Do') return task.status === 'To Do' || !task.status;
      if (activeTab === 'Done') return task.status === 'Done';
      if (activeTab === 'All') return true;
      if (activeTab === 'In Progress') return task.status === 'In Progress';
      return true;
    });
  }, [tasks, activeTab]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
          My Tasks
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Manage and track all your tactical boundaries and milestones.
        </p>
      </div>

      {alertMessage && (
        <div className="glass-card rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 p-4 text-xs font-bold text-amber-200 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>{alertMessage}</div>
        </div>
      )}

      <form
        onSubmit={handleInputSubmit}
        className="glass-card p-4 rounded-xl flex flex-col sm:flex-row gap-3 items-center border-purple-500/20"
      >
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type a new task... (or: mark existing task done)"
          className="flex-1 glass-card rounded-lg px-4 py-3 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 border-purple-500/20"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="glass-card rounded-lg px-3 py-3 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 border-purple-500/20"
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto btn-premium px-4 py-3 rounded-lg flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>{submitting ? 'Adding...' : 'Add Task'}</span>
        </button>
      </form>

      {overdueHighPriorityCount > 0 && (
        <div className="glass-card rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-500/10 to-orange-500/10 p-4 text-xs font-bold text-rose-200 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            {overdueHighPriorityCount === 1
              ? 'One high-priority task is overdue or due now. Take action immediately.'
              : `${overdueHighPriorityCount} high-priority tasks are overdue or due now.`}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center border-b border-purple-500/10 pb-4">
        <div className="flex glass-card p-1 rounded-lg gap-1">
          {['All', 'To Do', 'In Progress', 'Done'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                activeTab === tab
                  ? 'btn-premium'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-500 font-semibold">
          {filteredTasks.length} {activeTab.toLowerCase()} task
          {filteredTasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <p className="text-xs text-gray-400 font-semibold">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="glass-card p-8 rounded-xl text-center border-purple-500/20">
            <p className="text-xs text-gray-400 font-semibold">
              {activeTab === 'All'
                ? 'No tasks yet. Add one above to get started.'
                : `No tasks in "${activeTab}".`}
            </p>
          </div>
        ) : (
          filteredTasks.map((item) => {
            const isDone = item.status === 'Done';
            return (
              <div
                key={item.id}
                className="glass-card p-4 rounded-xl flex items-center justify-between gap-4 border-purple-500/20 hover:border-purple-500/40 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDone}
                      disabled={processingTaskId === item.id}
                      onChange={() => toggleTaskComplete(item.id)}
                      className="h-4 w-4 rounded border-gray-500 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className={`transition-all ${isDone ? 'text-emerald-400' : 'text-gray-200'}`}>
                      {isDone ? 'Done' : 'Mark done'}
                    </span>
                  </label>

                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-bold transition-all ${
                        isDone ? 'line-through text-gray-500' : 'text-gray-200'
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.scheduledTime && (
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5 font-medium">
                        <Clock className="h-3 w-3" /> {item.scheduledTime}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md border transition-all ${
                      item.priority === 'High'
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                        : item.priority === 'Medium'
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    {item.priority}
                  </span>

                  <button
                    onClick={() => handlePermanentDelete(item.id)}
                    disabled={processingTaskId === item.id}
                    className={`p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all ${
                      activeTab === 'Done' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Tasks;