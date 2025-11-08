import { BarChart3, TrendingUp, Shield, Activity } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ analysisData }) => {
  const mockData = {
    totalVideosAnalyzed: 127,
    threatsDetected: 8,
    personsTracked: 1543,
    vehiclesDetected: 289,
    averageProcessingTime: '2.3s',
    systemUptime: '99.8%'
  };

  const recentActivity = [
    { time: '14:32', event: 'Suspicious object detected', severity: 'high', location: 'Camera 3 - Main Gate' },
    { time: '14:15', event: 'Person loitering detected', severity: 'medium', location: 'Camera 7 - Parking Area' },
    { time: '13:58', event: 'Vehicle entry logged', severity: 'low', location: 'Camera 1 - Entry Point' },
    { time: '13:45', event: 'Face match found', severity: 'high', location: 'Camera 5 - Reception' },
    { time: '13:30', event: 'Crowd density alert', severity: 'medium', location: 'Camera 4 - Lobby' },
  ];

  const detectionTypes = [
    { name: 'Persons', count: 450, color: '#10b981', icon: '👤' },
    { name: 'Vehicles', count: 180, color: '#f59e0b', icon: '🚗' },
    { name: 'Objects', count: 320, color: '#3b82f6', icon: '📦' },
    { name: 'Threats', count: 8, color: '#ef4444', icon: '⚠️' },
  ];

  return (
    <div className="dashboard-container">
      {/* Overview Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
            <BarChart3 size={28} color="#3b82f6" />
          </div>
          <div className="metric-content">
            <span className="metric-label">Videos Analyzed</span>
            <span className="metric-value">{mockData.totalVideosAnalyzed}</span>
            <span className="metric-change positive">+12% this week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
            <Shield size={28} color="#ef4444" />
          </div>
          <div className="metric-content">
            <span className="metric-label">Threats Detected</span>
            <span className="metric-value">{mockData.threatsDetected}</span>
            <span className="metric-change negative">-25% this week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
            <Activity size={28} color="#10b981" />
          </div>
          <div className="metric-content">
            <span className="metric-label">Persons Tracked</span>
            <span className="metric-value">{mockData.personsTracked}</span>
            <span className="metric-change positive">+8% this week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
            <TrendingUp size={28} color="#f59e0b" />
          </div>
          <div className="metric-content">
            <span className="metric-label">System Uptime</span>
            <span className="metric-value">{mockData.systemUptime}</span>
            <span className="metric-change positive">Excellent</span>
          </div>
        </div>
      </div>

      {/* Detection Types */}
      <div className="card">
        <h3 className="section-title">
          <BarChart3 size={20} />
          Detection Distribution
        </h3>
        <div className="detection-types-grid">
          {detectionTypes.map((type, idx) => (
            <div key={idx} className="detection-type-card">
              <div className="detection-type-icon">{type.icon}</div>
              <div className="detection-type-info">
                <span className="detection-type-name">{type.name}</span>
                <span className="detection-type-count" style={{ color: type.color }}>
                  {type.count}
                </span>
              </div>
              <div className="detection-type-bar">
                <div
                  className="detection-type-progress"
                  style={{
                    width: `${(type.count / 500) * 100}%`,
                    background: type.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & System Info */}
      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="card activity-card">
          <h3 className="section-title">
            <Activity size={20} />
            Recent Activity
          </h3>
          <div className="activity-list">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-time">{activity.time}</div>
                <div className="activity-content">
                  <div className="activity-event">
                    <span className={`severity-badge ${activity.severity}`}></span>
                    {activity.event}
                  </div>
                  <div className="activity-location">{activity.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Information */}
        <div className="card system-info-card">
          <h3 className="section-title">
            <Shield size={20} />
            System Information
          </h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">AI Models Loaded</span>
              <span className="info-value">✓ Active</span>
            </div>
            <div className="info-item">
              <span className="info-label">COCO-SSD</span>
              <span className="info-value">v2.2.3</span>
            </div>
            <div className="info-item">
              <span className="info-label">BlazeFace</span>
              <span className="info-value">v0.0.7</span>
            </div>
            <div className="info-item">
              <span className="info-label">TensorFlow.js</span>
              <span className="info-value">v4.x</span>
            </div>
            <div className="info-item">
              <span className="info-label">Processing Speed</span>
              <span className="info-value">{mockData.averageProcessingTime}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Real-time Analysis</span>
              <span className="info-value">✓ Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="card capabilities-card">
        <h3 className="section-title">
          <Shield size={20} />
          System Capabilities
        </h3>
        <div className="capabilities-grid">
          <div className="capability-item">
            <div className="capability-icon">🎯</div>
            <h4>Object Detection</h4>
            <p>Real-time identification of 80+ object classes including weapons, explosives, and suspicious items</p>
          </div>
          <div className="capability-item">
            <div className="capability-icon">👥</div>
            <h4>Face Detection</h4>
            <p>Advanced facial detection and tracking for person identification and crowd monitoring</p>
          </div>
          <div className="capability-item">
            <div className="capability-icon">🚨</div>
            <h4>Threat Analysis</h4>
            <p>Automated detection and alert system for potential security threats and anomalies</p>
          </div>
          <div className="capability-item">
            <div className="capability-icon">📊</div>
            <h4>Analytics Engine</h4>
            <p>Comprehensive data analysis with exportable reports and visualization tools</p>
          </div>
          <div className="capability-item">
            <div className="capability-icon">🔄</div>
            <h4>Multi-Source Input</h4>
            <p>Compatible with various surveillance devices including drones, cameras, and body-cams</p>
          </div>
          <div className="capability-item">
            <div className="capability-icon">⚡</div>
            <h4>Real-time Processing</h4>
            <p>Low-latency video analysis with instant alert generation and response triggering</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
