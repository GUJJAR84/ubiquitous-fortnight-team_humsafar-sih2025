import { useState, useRef } from 'react';
import { Upload, Video, FileVideo, AlertCircle, CheckCircle } from 'lucide-react';
import './VideoUpload.css';

const VideoUpload = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/x-matroska', 'video/webm'];
      if (!validTypes.includes(file.type)) {
        setUploadStatus({
          type: 'error',
          message: 'Invalid file type. Please upload a video file (MP4, AVI, MOV, MKV, WEBM).'
        });
        return;
      }

      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setUploadStatus({
          type: 'error',
          message: 'File size exceeds 100MB limit. Please choose a smaller file.'
        });
        return;
      }

      setSelectedFile(file);
      setUploadStatus(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      // Create a mock event object
      const mockEvent = {
        target: {
          files: [file]
        }
      };
      handleFileSelect(mockEvent);
    }
  };

  const startAnalysis = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus({ type: 'info', message: 'Processing video for analysis...' });

    // Create object URL for video
    const videoUrl = URL.createObjectURL(selectedFile);
    
    // Simulate upload and pass to analysis
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus({ 
        type: 'success', 
        message: 'Video loaded successfully! Starting AI analysis...' 
      });
      
      // Pass video to parent for analysis
      onAnalysisComplete({ fileName: selectedFile.name, fileSize: selectedFile.size }, videoUrl);
    }, 1500);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="video-upload-container">
      <div className="card">
        <div className="card-header">
          <Video className="card-icon" size={28} />
          <h2 className="card-title">Video Input System</h2>
        </div>

        <div className="upload-info">
          <h3>Supported Input Sources:</h3>
          <ul className="source-list">
            <li><CheckCircle size={16} /> Surveillance Cameras (PTZ, Fixed, Dome)</li>
            <li><CheckCircle size={16} /> Body-worn Cameras</li>
            <li><CheckCircle size={16} /> Drone Footage (UAV Surveillance)</li>
            <li><CheckCircle size={16} /> Mobile Surveillance Robots</li>
            <li><CheckCircle size={16} /> Archived Video Footage</li>
          </ul>
          <p className="format-info">
            Supported formats: MP4, AVI, MOV, MKV, WEBM | Max size: 100MB
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`upload-area ${selectedFile ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          {!selectedFile ? (
            <>
              <Upload size={48} className="upload-icon" />
              <h3>Drop video file here or click to browse</h3>
              <p>Drag and drop your video file for AI-powered analysis</p>
            </>
          ) : (
            <div className="file-preview">
              <FileVideo size={48} className="file-icon" />
              <div className="file-info">
                <h3>{selectedFile.name}</h3>
                <p>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <button 
                className="btn-remove" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Status Message */}
        {uploadStatus && (
          <div className={`status-message ${uploadStatus.type}`}>
            {uploadStatus.type === 'error' && <AlertCircle size={20} />}
            {uploadStatus.type === 'success' && <CheckCircle size={20} />}
            <span>{uploadStatus.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="upload-actions">
          <button
            className="btn btn-primary"
            onClick={startAnalysis}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <span className="loading-spinner small"></span>
                Processing...
              </>
            ) : (
              <>
                <Video size={20} />
                Start AI Analysis
              </>
            )}
          </button>
          
          {selectedFile && !isUploading && (
            <button
              className="btn btn-secondary"
              onClick={clearSelection}
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
            🎯
          </div>
          <h3>Object Detection</h3>
          <p>Identify weapons, explosives, vehicles, and suspicious objects in real-time</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
            👤
          </div>
          <h3>Person Detection</h3>
          <p>Track individuals and analyze crowd density with face detection capabilities</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
            ⚠️
          </div>
          <h3>Threat Analysis</h3>
          <p>AI-powered detection of suspicious behavior, loitering, and unusual activities</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
            📊
          </div>
          <h3>Real-time Alerts</h3>
          <p>Instant notifications for potential security threats and anomalies</p>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
