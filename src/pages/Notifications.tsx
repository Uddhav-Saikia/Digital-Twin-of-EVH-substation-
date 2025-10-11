import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, Filter, Check, Trash2, Clock } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import './Notifications.css';

const Notifications: React.FC = () => {
  const {
    notifications,
    unreadCount,
    acknowledgeNotification,
    acknowledgeAll,
    deleteNotification,
    clearRead
  } = useNotifications();
  
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle size={20} />;
      case 'high':
        return <AlertTriangle size={20} />;
      case 'medium':
        return <Info size={20} />;
      case 'low':
        return <Bell size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const filteredNotifications = notifications.filter(notif => {
    const severityMatch = filterSeverity === 'all' || notif.severity === filterSeverity;
    const statusMatch = filterStatus === 'all' ||
      (filterStatus === 'unread' && !notif.acknowledged) ||
      (filterStatus === 'read' && notif.acknowledged);
    return severityMatch && statusMatch;
  });

  const criticalCount = notifications.filter(n => n.severity === 'critical' && !n.acknowledged).length;

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-subtitle">Manage system alerts and notifications</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={clearRead}>
            <Trash2 size={18} />
            Clear Read
          </button>
          <button className="btn-primary" onClick={acknowledgeAll}>
            <CheckCircle size={18} />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="notification-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f620', color: '#3b82f6' }}>
            <Bell size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{notifications.length}</div>
            <div className="stat-label">Total Notifications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{unreadCount}</div>
            <div className="stat-label">Unread</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dc262620', color: '#dc2626' }}>
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{criticalCount}</div>
            <div className="stat-label">Critical Unread</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98120', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{notifications.length - unreadCount}</div>
            <div className="stat-label">Acknowledged</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="notification-filters">
        <div className="filter-group">
          <Filter size={18} />
          <label>Severity:</label>
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-container">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={64} />
            <h3>No notifications found</h3>
            <p>All caught up! No notifications match your filters.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-card ${notification.severity} ${notification.acknowledged ? 'acknowledged' : ''}`}
              >
                <div className="notification-indicator" style={{ background: getSeverityColor(notification.severity) }} />
                
                <div className="notification-icon" style={{ color: getSeverityColor(notification.severity) }}>
                  {getSeverityIcon(notification.severity)}
                </div>

                <div className="notification-content">
                  <div className="notification-header">
                    <span className={`severity-badge ${notification.severity}`}>
                      {notification.severity.toUpperCase()}
                    </span>
                    <span className="notification-time">
                      <Clock size={14} />
                      {getTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  
                  <div className="notification-message">
                    {notification.message}
                  </div>

                  <div className="notification-timestamp">
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="notification-actions">
                  {!notification.acknowledged ? (
                    <button
                      className="btn-ack"
                      onClick={() => acknowledgeNotification(notification.id)}
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  ) : (
                    <span className="ack-badge">
                      <CheckCircle size={16} />
                      Read
                    </span>
                  )}
                  <button
                    className="btn-delete"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
