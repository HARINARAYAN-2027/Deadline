import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { notificationService } from '../../services/notificationService';
import { Bell, Lock } from 'lucide-react';

const parseScheduledTimeToToday = (scheduledTime) => {
  // Expected: "10:30 PM" (Firestore dataset example)
  if (typeof scheduledTime !== 'string') return null;

  const raw = scheduledTime.trim().replace(/\s+/g, ' ');
  const match = raw.match(/^([0-1]?\d|2[0-3]):([0-5]\d)\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  const taskTime = new Date();
  taskTime.setHours(hours, minutes, 0, 0);
  return taskTime;
};

const NotificationManager = () => {
  const { tasks = [] } = useTasks();
  const notifiedTasksRef = useRef(new Set());
  const notifiedAtMinuteBucketRef = useRef(new Set());
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  const permission = useMemo(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission;
  }, []);

  const [permissionState, setPermissionState] = useState(permission);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleEnableAlerts = async () => {
    // Must be called from direct user gesture (button click)
    const result = await notificationService.requestNotificationPermission();
    if (!mountedRef.current) return;
    if (result?.permission) setPermissionState(result.permission);
  };

  useEffect(() => {
    // permission can change after request; start loop only when granted
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    // Run exactly-once per task per minute bucket to avoid duplicates.
    const checkDeadlines = () => {
      const now = new Date();
      const bucketKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}|${now.getHours()}:${now.getMinutes()}`;

      for (const task of tasks) {
        try {
          if (!task || task.status === 'Done' || !task.scheduledTime) continue;
          if (notifiedTasksRef.current.has(task.id)) continue;

          const dueTime = parseScheduledTimeToToday(task.scheduledTime);
          if (!dueTime) continue;

          const msDiff = dueTime.getTime() - now.getTime();
          const minutesRemaining = msDiff / 60000;

          // Fire precisely 5 minutes before due time.
          // Use a small window to tolerate interval drift.
          if (minutesRemaining <= 5 && minutesRemaining > 4.85) {
            const dedupeKey = `${task.id}|${bucketKey}`;
            if (notifiedAtMinuteBucketRef.current.has(dedupeKey)) continue;

            notificationService.sendSystemNotification(`Deadline Alert: ${task.name}`, {
              body: `Reminder: "${task.name}" is due at ${task.scheduledTime}. 🚀`,
              tag: String(task.id),
            });

            notifiedAtMinuteBucketRef.current.add(dedupeKey);
            notifiedTasksRef.current.add(task.id);
          }
        } catch (err) {
          // keep loop resilient
          console.error('Deadline notification loop error:', err);
        }
      }
    };

    // Clear any existing loop before creating a new one.
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = setInterval(checkDeadlines, 20000);
    checkDeadlines();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [tasks]);

  useEffect(() => {
    // If permission is denied after being granted earlier, stop looping by clearing set & interval.
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') {
      notifiedTasksRef.current.clear();
      notifiedAtMinuteBucketRef.current.clear();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [permissionState]);

  if (permissionState === 'granted') return null;

  const isBlocked = permissionState === 'denied';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={
        `animate-bounce ${isBlocked ? 'shadow-[0_0_18px_rgba(244,63,94,0.35)]' : 'shadow-[0_0_20px_rgba(147,51,234,0.5)]'}`
      }>
        <button
          onClick={handleEnableAlerts}
          className={
            `flex flex-col items-start gap-2 ${isBlocked ? 'bg-gradient-to-r from-rose-600 to-red-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'} ` +
            'hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black px-4 py-3 rounded-xl border transition-all border-white/10'
          }
        >
          <div className="flex items-center gap-2">
            {isBlocked ? <Lock className="h-4 w-4" /> : <Bell className="h-4 w-4 animate-pulse" />}
            <span>{isBlocked ? 'Fix Blocked Alerts' : 'Enable System Alerts'}</span>
          </div>

          {isBlocked ? (
            <span className="text-[10px] font-semibold text-white/90 leading-tight">
              Browser has blocked notifications for this site. Click the lock icon (🔒) in the address bar → enable Notifications.
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-white/90 leading-tight">
              This needs your permission to show native desktop alerts.
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default NotificationManager;
