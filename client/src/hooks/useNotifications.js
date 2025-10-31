
import { useState, useEffect, useCallback } from "react";

export const useNotifications = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then(setPermission);
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    if (!notificationsEnabled) return;

    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXyzn0vBSl+zPLaizsKFGC16OyrWBQLSKLf8sFuJAUuhM/y24k4CBhjtOrpoVIRC0uj4PG4YxwFN4/X8sx7LgUngMry3Ik6CRVhtOnrq1cUC0ef3vLBbiQFLoTP8tuJOQgYY7Tq6aFSEQtLpOHxuGIcBTeP1vLNey4FJ4DK8tyJOwkUYLPo7KtYFAtHnt/ywW4lBS6Ez/HbiTkIGGO06umhUREMTKPh8bhjHAU3j9byzXsvBSaAyvLciToJFGCz6eyrWBQLR57f8sFuJAUuhM/y24k5CBhjtOrpoVIRDEyk4fG4YhwFN4/W8s17LgUngMry3Ik6CRRgs+nrq1kVC0ae3/LBbiUFLoTP8duJOQgYY7Tq6aFSEQxMpOHxuGIcBTeP1vLNey4FJ4DK8tyJOgkUYLPp66tZFQtGnt/ywW4lBS6Ez/HbiTkIGGO06umhUhEMTKTh8bhjHAU3j9byzXsuBSeAyvLciToJFGCz6eyrWRULRp7f8sFuJQUuhM/x24k5CBhjtOrpoVIRDEyk4fG4YhwFN4/W8s17LgUngMry3Ik6CRRgs+nrq1kVC0ae3/LBbiUFLoTP8duJOQgYY7Tq6aFSEQxMpOHxuGIcBTeP1vLNey4FJ4DK8tyJOgkUYLPp66tZFQtGnt/ywW4lBS6Ez/HbiTkIGGO06umhUhEMTKTh8bhjHAU3j9byzXsuBSeAyvLciToJFGCz6eurWRULRp7f8sFuJQUuhM/x24k5CBhjtOrpoVIRDEyk4fG4YhwFN4/W8s17LgUngMry3Ik6CRRgs+nrq1kVC0ae3/LBbiUFLoTP8duJOQgYY7Tq6aFSEQxMpOHxuGIcBTeP1vLNey4FJ4DK8tyJOgkUYLPp66tZFQtGnt/ywW4lBS6Ez/HbiTkIGGO06umhUhEMTKTh8bg="
    );
    audio.play().catch((e) => console.log("Audio play failed:", e));
  }, [notificationsEnabled]);

  const showBrowserNotification = useCallback(
    (message) => {
      if (
        !notificationsEnabled ||
        permission !== "granted" ||
        document.hasFocus()
      )
        return;

      new Notification("New Message", {
        body: `${message.sender}: ${message.message}`,
        icon: "/chat-icon.png",
        badge: "/chat-icon.png",
        tag: "chat-notification",
        requireInteraction: false,
      });
    },
    [notificationsEnabled, permission]
  );

  const toggleNotifications = useCallback(() => {
    setNotificationsEnabled((prev) => !prev);
  }, []);

  return {
    notificationsEnabled,
    playNotificationSound,
    showBrowserNotification,
    toggleNotifications,
  };
};