import { useState } from 'react';
import { Shield, Video, BarChart3, Activity, AlertTriangle } from 'lucide-react';
import VideoUpload from './components/VideoUpload';
import VideoAnalysis from './components/VideoAnalysis';
import Dashboard from './components/Dashboard';
import AnalysisHistory from './components/AnalysisHistory';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('upload');
  const [analysisData, setAnalysisData] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);

  const handleAnalysisComplete = (data, video) => {
    setAnalysisData(data);
    setVideoSrc(video);
    setCurrentTab('analysis');
  };

  const tabs = [
    { id: 'upload', name: 'Video Upload', icon: Video },
    { id: 'analysis', name: 'Real-time Analysis', icon: Activity },
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'history', name: 'History', icon: AlertTriangle },
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <Shield className="logo-icon" size={32} />
            <div>
              <h1 className="app-title">NSG Video Intelligence</h1>
              <p className="app-subtitle">AI/ML-Powered Surveillance Analysis System</p>
            </div>
          </div>
          <div className="header-badge">
            <span className="badge">Ministry of Home Affairs</span>
            <span className="badge">National Security Guard</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${currentTab === tab.id ? 'active' : ''}`}
              onClick={() => setCurrentTab(tab.id)}
            >
              <Icon size={20} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {currentTab === 'upload' && (
          <VideoUpload onAnalysisComplete={handleAnalysisComplete} />
        )}
        {currentTab === 'analysis' && (
          <VideoAnalysis analysisData={analysisData} videoSrc={videoSrc} />
        )}
        {currentTab === 'dashboard' && (
          <Dashboard analysisData={analysisData} />
        )}
        {currentTab === 'history' && (
          <AnalysisHistory />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 NSG Video Intelligence System | Smart India Hackathon | Powered by AI/ML</p>
      </footer>
    </div>
  );
}

export default App;
