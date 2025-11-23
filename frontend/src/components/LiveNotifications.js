import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Gift } from 'lucide-react';
import { Card } from './ui/card';

const LiveNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  // Mock notifications (in real app, would come from WebSocket/API)
  const mockNotifications = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      color: 'green',
      title: 'Nouvelle leçon disponible !',
      message: 'Votre professeur a publié une nouvelle leçon : "Les temps du passé"',
      time: 'Il y a 5 minutes',
      unread: true
    },
    {
      id: 2,
      type: 'gift',
      icon: Gift,
      color: 'purple',
      title: 'Badge débloqué !',
      message: 'Félicitations ! Vous avez débloqué le badge "Étudiant Assidu"',
      time: 'Il y a 2 heures',
      unread: true
    },
    {
      id: 3,
      type: 'info',
      icon: Info,
      color: 'blue',
      title: 'Message de votre professeur',
      message: 'N\'oubliez pas le devoir pour demain !',
      time: 'Il y a 1 jour',
      unread: false
    }
  ];

  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications(mockNotifications);
    }, 1000);

    // Simulate new notification arriving
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 30 seconds
        const newNotif = {
          id: Date.now(),
          type: 'info',
          icon: Bell,
          color: 'teal',
          title: 'Nouveau défi disponible',
          message: 'Complétez le défi du jour et gagnez 50 XP !',
          time: 'À l\'instant',
          unread: true
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border-2 border-teal-200"
      >
        <Bell className="w-6 h-6 text-teal-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {showPanel && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowPanel(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 mt-2 w-80 md:w-96 max-h-[500px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-white" />
                <h3 className="text-white font-bold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-white text-teal-600 text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[420px]">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                        notif.unread ? 'bg-teal-50' : ''
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 bg-${notif.color}-100 rounded-full flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${notif.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                              {notif.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notif.id);
                              }}
                              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => setNotifications([])}
                  className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Tout supprimer
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LiveNotifications;
