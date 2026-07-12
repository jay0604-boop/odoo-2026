import React, { useState, useEffect } from 'react';
import { Bell, ShieldAlert, ArrowLeftRight, CheckCircle, Info, Calendar } from 'lucide-react';

/* ==========================================================================
   BACKEND INTEGRATION LAYER (For Member 1)
   ========================================================================== */

const notificationsApi = {
  /**
   * Fetch user activity notifications.
   * // TODO: Member 1 - Connect your endpoint here: GET /api/v1/activities/notifications
   */
  fetchNotifications: async () => {
    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      {
        id: 'n-1',
        type: 'transfer',
        title: 'Transfer Request Received',
        description: 'Employee John Smith requested transfer of "Dell 27 Monitor" (CN-0M482X).',
        timestamp: '2026-07-12T09:30:00Z',
        read: false,
      },
      {
        id: 'n-2',
        type: 'booking',
        title: 'Booking Approved',
        description: 'Your booking reservation for "Conference Room Alpha" on 2026-07-15 is approved.',
        timestamp: '2026-07-12T08:15:00Z',
        read: false,
      },
      {
        id: 'n-3',
        type: 'alert',
        title: 'Asset Return Warning',
        description: 'Reminder: "Dell 27 Monitor" was scheduled for return on 2026-07-10. Please return or extend.',
        timestamp: '2026-07-10T12:00:00Z',
        read: true,
      },
      {
        id: 'n-4',
        type: 'info',
        title: 'Security Policy Update',
        description: 'IT Governance updated the external asset allowance policy. Please review.',
        timestamp: '2026-07-08T15:45:00Z',
        read: true,
      },
    ];
  },

  /**
   * Mark notification as read.
   * // TODO: Member 1 - Connect your endpoint here: PATCH /api/v1/activities/notifications/:id/read
   */
  markAsRead: async (notificationId) => {
    // Mock latency
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log(`Notification ${notificationId} marked as read.`);
    return { success: true };
  }
};

/* ==========================================================================
   NOTIFICATIONS SCREEN COMPONENT
   ========================================================================== */

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All' | 'Unread' | 'Read'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await notificationsApi.fetchNotifications();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const res = await notificationsApi.markAsRead(id);
      if (res.success) {
        setNotifications(
          notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'Unread') return !notif.read;
    if (filter === 'Read') return notif.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'transfer':
        return <ArrowLeftRight className="h-5 w-5 text-amber-400" />;
      case 'booking':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'alert':
        return <ShieldAlert className="h-5 w-5 text-rose-400" />;
      default:
        return <Info className="h-5 w-5 text-brand-400" />;
    }
  };

  const getRelativeTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 600);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Activity Log</h3>
          <p className="text-sm text-slate-400">Review your recent transfers, bookings, and notifications.</p>
        </div>

        {/* Filter buttons */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-semibold self-start sm:self-auto">
          {['All', 'Unread', 'Read'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filter === t
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications timeline list */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <svg className="animate-spin h-7 w-7 text-brand-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-xl border transition-all flex gap-4 bg-slate-900 ${
                notif.read ? 'border-slate-800/80 opacity-75' : 'border-brand-500/25 shadow-md shadow-brand-500/[0.02]'
              }`}
            >
              {/* Icon Container */}
              <div className="h-10 w-10 shrink-0 bg-slate-950 rounded-lg border border-slate-850 flex items-center justify-center">
                {getIcon(notif.type)}
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-sm font-bold text-slate-100 truncate">{notif.title}</h4>
                  <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 shrink-0 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    {getRelativeTime(notif.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                  {notif.description}
                </p>

                {/* Mark as read link */}
                {!notif.read && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="text-[10px] font-bold text-brand-400 hover:text-brand-350 mt-3 transition-colors block"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <Bell className="h-8 w-8 text-slate-650 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-200">Timeline is empty</h4>
          <p className="text-xs text-slate-400 mt-1">You have no notifications in this filter category.</p>
        </div>
      )}

    </div>
  );
}
