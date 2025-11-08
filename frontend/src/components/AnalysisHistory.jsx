import { Clock, FileVideo, AlertTriangle, TrendingUp } from 'lucide-react';
import './AnalysisHistory.css';

const AnalysisHistory = () => {
  const historyData = [
    {
      id: 1,
      fileName: 'surveillance_gate_2024_01.mp4',
      timestamp: '2024-11-08 14:30:15',
      duration: '5:23',
      detections: { persons: 15, vehicles: 3, threats: 1, objects: 28 },
      status: 'completed',
      threats: ['Suspicious object detected at 2:45'],
      source: 'Camera 3 - Main Gate'
    },
    {
      id: 2,
      fileName: 'drone_footage_perimeter.mp4',
      timestamp: '2024-11-08 13:15:42',
      duration: '8:17',
      detections: { persons: 8, vehicles: 12, threats: 0, objects: 45 },
      status: 'completed',
      threats: [],
      source: 'Drone Unit 2'
    },
    {
      id: 3,
      fileName: 'bodycam_patrol_01.mp4',
      timestamp: '2024-11-08 12:05:33',
      duration: '12:41',
      detections: { persons: 34, vehicles: 7, threats: 2, objects: 67 },
      status: 'completed',
      threats: ['Knife detected at 7:20', 'Loitering detected at 10:15'],
      source: 'Body Cam Unit 5'
    },
    {
      id: 4,
      fileName: 'parking_area_recording.mp4',
      timestamp: '2024-11-08 10:45:18',
      duration: '15:30',
      detections: { persons: 45, vehicles: 23, threats: 0, objects: 89 },
      status: 'completed',
      threats: [],
      source: 'Camera 7 - Parking'
    },
    {
      id: 5,
      fileName: 'entrance_surveillance.mp4',
      timestamp: '2024-11-08 09:20:07',
      duration: '6:52',
      detections: { persons: 28, vehicles: 5, threats: 1, objects: 52 },
      status: 'completed',
      threats: ['Unidentified object at entrance'],
      source: 'Camera 1 - Main Entrance'
    },
  ];

  const getTotalDetections = (detections) => {
    return detections.persons + detections.vehicles + detections.objects;
  };

  return (
    <div className="history-container">
      <div className="card">
        <div className="card-header">
          <Clock className="card-icon" size={28} />
          <h2 className="card-title">Analysis History</h2>
        </div>

        {/* Summary Statistics */}
        <div className="history-stats">
          <div className="history-stat-item">
            <FileVideo size={20} />
            <div>
              <span className="stat-number">{historyData.length}</span>
              <span className="stat-label">Total Analyses</span>
            </div>
          </div>
          <div className="history-stat-item">
            <AlertTriangle size={20} />
            <div>
              <span className="stat-number">
                {historyData.reduce((acc, item) => acc + item.detections.threats, 0)}
              </span>
              <span className="stat-label">Threats Detected</span>
            </div>
          </div>
          <div className="history-stat-item">
            <TrendingUp size={20} />
            <div>
              <span className="stat-number">
                {historyData.reduce((acc, item) => acc + getTotalDetections(item.detections), 0)}
              </span>
              <span className="stat-label">Total Detections</span>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Video File</th>
                <th>Source</th>
                <th>Timestamp</th>
                <th>Duration</th>
                <th>Detections</th>
                <th>Threats</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.id} className="history-row">
                  <td>
                    <div className="file-cell">
                      <FileVideo size={18} className="file-icon" />
                      <span className="file-name">{item.fileName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="source-badge">{item.source}</span>
                  </td>
                  <td className="timestamp-cell">{item.timestamp}</td>
                  <td className="duration-cell">{item.duration}</td>
                  <td>
                    <div className="detections-cell">
                      <span className="detection-badge persons">
                        👤 {item.detections.persons}
                      </span>
                      <span className="detection-badge vehicles">
                        🚗 {item.detections.vehicles}
                      </span>
                      <span className="detection-badge objects">
                        📦 {item.detections.objects}
                      </span>
                    </div>
                  </td>
                  <td>
                    {item.detections.threats > 0 ? (
                      <div className="threats-cell">
                        <span className="threat-badge">
                          ⚠️ {item.detections.threats}
                        </span>
                        <div className="threat-tooltip">
                          {item.threats.map((threat, idx) => (
                            <div key={idx} className="threat-item">{threat}</div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="no-threats">No threats</span>
                    )}
                  </td>
                  <td>
                    <span className="status-badge completed">
                      ✓ Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="card export-card">
        <h3 className="section-title">
          <FileVideo size={20} />
          Export & Reports
        </h3>
        <div className="export-options">
          <button className="btn btn-primary">
            📊 Export as CSV
          </button>
          <button className="btn btn-primary">
            📄 Generate PDF Report
          </button>
          <button className="btn btn-primary">
            📈 Analytics Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistory;
