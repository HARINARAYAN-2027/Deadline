class NotificationService {
  constructor() {
    this.hasPermission = false;
    this._audioUrl = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-200.wav';
    this.checkPermission();
  }

  checkPermission() {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    this.hasPermission = Notification.permission === 'granted';
  }

  /**
   * Must be called from a direct user gesture (button click), otherwise browsers may block.
   */
  async requestNotificationPermission() {
    if (typeof window === 'undefined') return { ok: false, permission: undefined };
    if (!('Notification' in window)) {
      return { ok: false, permission: undefined, reason: 'unsupported' };
    }

    try {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      if (permission === 'granted') {
        // Informative toast-style notification; must be triggered from the user click path.
        this.sendSystemNotification('System Alerts Enabled! 🔔', {
          body: 'Deadline alerts are now enabled. 🚀',
        });
        return { ok: true, permission };
      }

      return { ok: false, permission };
    } catch (err) {
      console.error('Notification permission request failed:', err);
      return { ok: false, permission: undefined, reason: 'error' };
    }
  }

  sendSystemNotification(title, options = {}) {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;

    if (Notification.permission !== 'granted') {
      return;
    }

    const defaultOptions = {
      icon: '/logo.png',
      badge: '/logo.png',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      tag: undefined,
      ...options,
    };

    try {
      // Native desktop banner
      // eslint-disable-next-line no-new
      new Notification(title, defaultOptions);
    } catch (err) {
      console.error('Failed to render notification object:', err);
      return;
    }

    // Chime (may be blocked unless a user gesture has happened at least once in the page lifetime)
    try {
      const audio = new Audio(this._audioUrl);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (err) {
      // ignore audio failures
    }
  }
}

export const notificationService = new NotificationService();
