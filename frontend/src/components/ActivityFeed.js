import React, { useState, useEffect } from 'react';
import { Bell, X, Activity, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import apiClient from '../utils/api';

const ActivityFeed = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications/my-notifications');
      setNotifications(res.data || []);
      const unread = (res.data || []).filter(n => !n.is_read).length;
      setUnreadCount(unread);
      
      // Afficher les nouvelles notifications en toast flottant
      const newUnread = (res.data || []).filter(n => !n.is_read);
      newUnread.slice(0, 3).forEach((notif, index) => {
        setTimeout(() => {
          showLiveNotification(notif);
        }, index * 1000);
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const showLiveNotification = (notif) => {
    const id = Date.now() + Math.random();
    setLiveNotifications(prev => [...prev, { ...notif, tempId: id }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setLiveNotifications(prev => prev.filter(n => n.tempId !== id));
    }, 5000);
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.put('/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('✅ Toutes les activités sont marquées comme lues');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const getIcon = (type) => {
    const icons = {
      message: '💬',
      news: '📰',
      club: '🏆',
      book: '📚'
    };
    return icons[type] || '🔔';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    
    if (diffInMinutes < 1) return 'maintenant';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}j`;
  };

  return (
    <>
      {/* Live Notifications - Bottom Right Toasts */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
        {liveNotifications.map((notif) => (
          <div
            key={notif.tempId}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-xl shadow-2xl animate-in slide-in-from-right duration-500 border-2 border-teal-400"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{getIcon(notif.type)}</div>
              <div className="flex-1">
                <p className="font-bold text-sm">{notif.title}</p>
                <p className="text-xs text-teal-100 mt-1">{notif.message}</p>
              </div>
              <button
                onClick={() => setLiveNotifications(prev => prev.filter(n => n.tempId !== notif.tempId))}
                className="text-white hover:bg-teal-700 rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-teal-50 transition-all group"
      >
        <Bell className={`w-6 h-6 text-teal-600 ${unreadCount > 0 ? 'animate-wiggle' : 'group-hover:scale-110'} transition-all`} />
      </Button>

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 animate-pulse" />
              <h2 className="text-xl font-bold">Activités</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-teal-800 rounded-full p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-teal-100">
            {unreadCount > 0 ? `${unreadCount} nouvelle(s) activité(s)` : 'Vous êtes à jour ! 🎉'}
          </p>
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="mt-2 text-white hover:bg-teal-800"
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {/* Activity List */}
        <div className="overflow-y-auto h-[calc(100%-140px)]">
          {notifications.length === 0 ? (
            <div className="text-center py-16 px-6">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">Aucune activité</p>
              <p className="text-sm text-gray-400 mt-2">Les nouvelles activités apparaîtront ici</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition ${
                  !notif.is_read ? 'bg-teal-50' : ''
                }`}
                onClick={() => !notif.is_read && markAsRead(notif.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${!notif.is_read ? 'text-teal-800' : 'text-gray-800'}`}>
                      {notif.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">{formatTime(notif.created_at)}</span>
                      {!notif.is_read && (
                        <Badge className="bg-teal-500 text-white text-xs">Nouveau</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ActivityFeed;
