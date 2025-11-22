import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import apiClient from '../utils/api';
import { toast } from 'sonner';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications/my-notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiClient.post(`/notifications/mark-read/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'new_message':
        return `💬 Nouveau message de ${notification.from_name}`;
      case 'new_document':
        return `📄 Nouveau document: ${notification.title}`;
      case 'new_link':
        return `🔗 Nouveau lien: ${notification.title}`;
      case 'homework_submitted':
        return `📚 ${notification.student_name} a rendu un devoir`;
      default:
        return notification.message || 'Nouvelle notification';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Aucune notification</div>
        ) : (
          notifications.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-3 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{getNotificationText(notif)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notif.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
