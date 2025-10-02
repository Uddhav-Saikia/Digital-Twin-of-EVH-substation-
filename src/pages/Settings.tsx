import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Palette, Globe, Key } from 'lucide-react';
import './Settings.css';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="settings">
      <div className="page-header">
        <div>
          <h1>System Settings</h1>
          <p className="page-subtitle">Configure system preferences and integrations</p>
        </div>
      </div>

      <div className="settings-container">
        {/* Sidebar Navigation */}
        <div className="settings-sidebar">
          <button 
            className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <SettingsIcon size={20} />
            General
          </button>
          <button 
            className={`settings-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <User size={20} />
            Users & Access
          </button>
          <button 
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={20} />
            Notifications
          </button>
          <button 
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={20} />
            Security
          </button>
          <button 
            className={`settings-tab ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            <Database size={20} />
            Integrations
          </button>
          <button 
            className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette size={20} />
            Appearance
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-panel">
              <h2>General Settings</h2>
              
              <div className="setting-group">
                <h3>Substation Information</h3>
                <div className="setting-item">
                  <label>Substation Name</label>
                  <input type="text" defaultValue="EHV Central Substation" />
                </div>
                <div className="setting-item">
                  <label>Location</label>
                  <input type="text" defaultValue="Grid Region 4 - North" />
                </div>
                <div className="setting-item">
                  <label>Operator Company</label>
                  <input type="text" defaultValue="National Grid Corporation" />
                </div>
                <div className="setting-item">
                  <label>Commission Date</label>
                  <input type="date" defaultValue="2018-06-15" />
                </div>
              </div>

              <div className="setting-group">
                <h3>System Preferences</h3>
                <div className="setting-item">
                  <label>Time Zone</label>
                  <select defaultValue="UTC">
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="IST">Indian Standard Time</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Date Format</label>
                  <select defaultValue="MM/DD/YYYY">
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Language</label>
                  <select defaultValue="en">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>

              <div className="setting-group">
                <h3>Data Retention</h3>
                <div className="setting-item">
                  <label>SCADA Data Retention (days)</label>
                  <input type="number" defaultValue="90" />
                  <span className="setting-hint">Historical SCADA data storage period</span>
                </div>
                <div className="setting-item">
                  <label>Event Log Retention (days)</label>
                  <input type="number" defaultValue="365" />
                  <span className="setting-hint">System events and alerts retention</span>
                </div>
                <div className="setting-item">
                  <label>Report Archive (years)</label>
                  <input type="number" defaultValue="5" />
                  <span className="setting-hint">Generated reports archive period</span>
                </div>
              </div>

              <button className="btn-primary">Save Changes</button>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="settings-panel">
              <h2>Users & Access Control</h2>
              
              <div className="users-header">
                <button className="btn-primary">Add New User</button>
              </div>

              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Last Login</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Smith</td>
                      <td>john.smith@utility.com</td>
                      <td><span className="role-badge admin">Administrator</span></td>
                      <td>2025-10-02 09:15</td>
                      <td><span className="status-badge active">Active</span></td>
                      <td>
                        <button className="btn-link">Edit</button>
                        <button className="btn-link">Disable</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Sarah Johnson</td>
                      <td>sarah.j@utility.com</td>
                      <td><span className="role-badge operator">Operator</span></td>
                      <td>2025-10-02 08:30</td>
                      <td><span className="status-badge active">Active</span></td>
                      <td>
                        <button className="btn-link">Edit</button>
                        <button className="btn-link">Disable</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Mike Davis</td>
                      <td>m.davis@utility.com</td>
                      <td><span className="role-badge engineer">Engineer</span></td>
                      <td>2025-10-01 16:45</td>
                      <td><span className="status-badge active">Active</span></td>
                      <td>
                        <button className="btn-link">Edit</button>
                        <button className="btn-link">Disable</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="setting-group">
                <h3>Role Permissions</h3>
                <div className="role-permissions">
                  <div className="role-card">
                    <h4>Administrator</h4>
                    <ul className="permissions-list">
                      <li>✓ Full system access</li>
                      <li>✓ User management</li>
                      <li>✓ System configuration</li>
                      <li>✓ All modules</li>
                    </ul>
                  </div>
                  <div className="role-card">
                    <h4>Operator</h4>
                    <ul className="permissions-list">
                      <li>✓ SCADA monitoring</li>
                      <li>✓ Asset viewing</li>
                      <li>✓ Acknowledge alerts</li>
                      <li>✗ System configuration</li>
                    </ul>
                  </div>
                  <div className="role-card">
                    <h4>Engineer</h4>
                    <ul className="permissions-list">
                      <li>✓ Asset management</li>
                      <li>✓ Maintenance planning</li>
                      <li>✓ Analytics access</li>
                      <li>✗ User management</li>
                    </ul>
                  </div>
                  <div className="role-card">
                    <h4>Viewer</h4>
                    <ul className="permissions-list">
                      <li>✓ Dashboard viewing</li>
                      <li>✓ Report download</li>
                      <li>✗ Asset modification</li>
                      <li>✗ System changes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-panel">
              <h2>Notification Settings</h2>
              
              <div className="setting-group">
                <h3>Alert Thresholds</h3>
                <div className="setting-item">
                  <label>Critical Alert Response Time (minutes)</label>
                  <input type="number" defaultValue="15" />
                </div>
                <div className="setting-item">
                  <label>High Alert Response Time (minutes)</label>
                  <input type="number" defaultValue="60" />
                </div>
                <div className="setting-item">
                  <label>Temperature Threshold (°C)</label>
                  <input type="number" defaultValue="85" />
                </div>
                <div className="setting-item">
                  <label>Load Threshold (%)</label>
                  <input type="number" defaultValue="90" />
                </div>
              </div>

              <div className="setting-group">
                <h3>Notification Channels</h3>
                <div className="notification-channels">
                  <div className="channel-item">
                    <input type="checkbox" id="email" defaultChecked />
                    <label htmlFor="email">
                      <strong>Email Notifications</strong>
                      <span>Send alerts via email</span>
                    </label>
                  </div>
                  <div className="channel-item">
                    <input type="checkbox" id="sms" />
                    <label htmlFor="sms">
                      <strong>SMS Alerts</strong>
                      <span>Critical alerts via text message</span>
                    </label>
                  </div>
                  <div className="channel-item">
                    <input type="checkbox" id="push" defaultChecked />
                    <label htmlFor="push">
                      <strong>Push Notifications</strong>
                      <span>Browser push notifications</span>
                    </label>
                  </div>
                  <div className="channel-item">
                    <input type="checkbox" id="webhook" />
                    <label htmlFor="webhook">
                      <strong>Webhook</strong>
                      <span>Send alerts to external systems</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <h3>Alert Recipients</h3>
                <div className="recipients-list">
                  <div className="recipient-item">
                    <span>Operations Team</span>
                    <span className="recipient-email">ops@utility.com</span>
                    <button className="btn-link">Edit</button>
                  </div>
                  <div className="recipient-item">
                    <span>Maintenance Team</span>
                    <span className="recipient-email">maintenance@utility.com</span>
                    <button className="btn-link">Edit</button>
                  </div>
                  <div className="recipient-item">
                    <span>On-Call Engineer</span>
                    <span className="recipient-email">oncall@utility.com</span>
                    <button className="btn-link">Edit</button>
                  </div>
                </div>
                <button className="btn-secondary">Add Recipient</button>
              </div>

              <button className="btn-primary">Save Settings</button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-panel">
              <h2>Security Settings</h2>
              
              <div className="setting-group">
                <h3>Authentication</h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Require Two-Factor Authentication (2FA)
                  </label>
                </div>
                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <input type="number" defaultValue="30" />
                </div>
                <div className="setting-item">
                  <label>Password Expiry (days)</label>
                  <input type="number" defaultValue="90" />
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Enforce Strong Passwords
                  </label>
                  <span className="setting-hint">Minimum 12 characters, mixed case, numbers, symbols</span>
                </div>
              </div>

              <div className="setting-group">
                <h3>Access Control</h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    IP Whitelist Enforcement
                  </label>
                </div>
                <div className="setting-item">
                  <label>Allowed IP Ranges</label>
                  <textarea rows={3} defaultValue="10.0.0.0/8&#10;192.168.1.0/24" />
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    Enable VPN Requirement
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <h3>Audit Logging</h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Log All User Actions
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Log System Changes
                  </label>
                </div>
                <div className="setting-item">
                  <label>Audit Log Retention (days)</label>
                  <input type="number" defaultValue="730" />
                </div>
              </div>

              <button className="btn-primary">Update Security Settings</button>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="settings-panel">
              <h2>System Integrations</h2>
              
              <div className="integrations-grid">
                <div className="integration-card">
                  <div className="integration-icon scada">
                    <Database size={32} />
                  </div>
                  <h3>SCADA System</h3>
                  <p>IEC 61850 / DNP3 / Modbus</p>
                  <div className="integration-status disconnected">Disconnected</div>
                  <button className="btn-primary">Configure</button>
                  <div className="tech-note">
                    <strong>Requirements:</strong> Protocol gateway, IP address, port, authentication
                  </div>
                </div>

                <div className="integration-card">
                  <div className="integration-icon iot">
                    <Globe size={32} />
                  </div>
                  <h3>IoT Sensor Network</h3>
                  <p>LoRaWAN / MQTT Integration</p>
                  <div className="integration-status disconnected">Disconnected</div>
                  <button className="btn-primary">Configure</button>
                  <div className="tech-note">
                    <strong>Requirements:</strong> MQTT broker, sensor registry, data parsing rules
                  </div>
                </div>

                <div className="integration-card">
                  <div className="integration-icon database">
                    <Database size={32} />
                  </div>
                  <h3>Time-Series Database</h3>
                  <p>InfluxDB / TimescaleDB</p>
                  <div className="integration-status disconnected">Disconnected</div>
                  <button className="btn-primary">Configure</button>
                  <div className="tech-note">
                    <strong>Requirements:</strong> Database URL, credentials, retention policies
                  </div>
                </div>

                <div className="integration-card">
                  <div className="integration-icon api">
                    <Key size={32} />
                  </div>
                  <h3>REST API</h3>
                  <p>External System Integration</p>
                  <div className="integration-status connected">Connected</div>
                  <button className="btn-secondary">Manage</button>
                  <div className="tech-note">
                    API endpoint: https://api.substationdt.com/v1
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <h3>API Configuration</h3>
                <div className="setting-item">
                  <label>API Rate Limit (requests/minute)</label>
                  <input type="number" defaultValue="100" />
                </div>
                <div className="setting-item">
                  <label>API Key</label>
                  <div className="api-key-display">
                    <code>sk_live_****************************</code>
                    <button className="btn-link">Regenerate</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-panel">
              <h2>Appearance Settings</h2>
              
              <div className="setting-group">
                <h3>Theme</h3>
                <div className="theme-options">
                  <div className="theme-card selected">
                    <div className="theme-preview light"></div>
                    <input type="radio" name="theme" value="light" defaultChecked />
                    <label>Light</label>
                  </div>
                  <div className="theme-card">
                    <div className="theme-preview dark"></div>
                    <input type="radio" name="theme" value="dark" />
                    <label>Dark</label>
                  </div>
                  <div className="theme-card">
                    <div className="theme-preview auto"></div>
                    <input type="radio" name="theme" value="auto" />
                    <label>Auto</label>
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <h3>Dashboard Preferences</h3>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Show System Health Widget
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Show Power Flow Chart
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Show Recent Alerts
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    Show Quick Access Cards
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <h3>Chart Settings</h3>
                <div className="setting-item">
                  <label>Default Time Range</label>
                  <select defaultValue="24h">
                    <option value="1h">Last Hour</option>
                    <option value="6h">Last 6 Hours</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Chart Refresh Interval (seconds)</label>
                  <input type="number" defaultValue="5" />
                </div>
              </div>

              <button className="btn-primary">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
