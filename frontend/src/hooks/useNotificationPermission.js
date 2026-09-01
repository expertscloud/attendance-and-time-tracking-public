import { useEffect } from 'react';

const NOTIFICATION_ICON = `${import.meta.env.BASE_URL}logo-small.png`;

export const showNotification = (title, body) => {
  if (window.ipcRenderer?.send) {
    window.ipcRenderer.send('show-notification', { title, body });
    return;
  }

  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification(title, { body, icon: NOTIFICATION_ICON });
  }
};

const useNotificationPermission = () => {
  useEffect(() => {
    (async () => {
      if (window.ipcRenderer?.invoke) {
        await window.ipcRenderer.invoke('request-notification-permission');
        return;
      }
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    })();
  }, []);
};

export default useNotificationPermission;
