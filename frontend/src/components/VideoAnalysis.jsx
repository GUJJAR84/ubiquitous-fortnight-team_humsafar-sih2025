import { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as blazeface from '@tensorflow-models/blazeface';
import { Play, Pause, RotateCcw, AlertTriangle, Target, Users, Eye } from 'lucide-react';
import './VideoAnalysis.css';

const VideoAnalysis = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [model, setModel] = useState(null);
  const [faceModel, setFaceModel] = useState(null);
  const [detections, setDetections] = useState([]);
  const [stats, setStats] = useState({
    totalObjects: 0,
    persons: 0,
    threats: 0,
    vehicles: 0,
    faces: 0
  });
  const [alerts, setAlerts] = useState([]);
  const animationRef = useRef(null);

  // Threat keywords
  const threatObjects = ['knife', 'scissors', 'baseball bat', 'bottle'];
  const vehicleTypes = ['car', 'truck', 'bus', 'motorcycle', 'bicycle'];

  useEffect(() => {
    loadModels();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const loadModels = async () => {
    try {
      await tf.ready();
      const cocoModel = await cocoSsd.load();
      const blazeFaceModel = await blazeface.load();
      setModel(cocoModel);
      setFaceModel(blazeFaceModel);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        if (isAnalyzing) {
          detectFrame();
        }
      }
    }
  };

  const handleReset = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
      setIsPlaying(false);
      setIsAnalyzing(false);
      setDetections([]);
      setAlerts([]);
      setStats({
        totalObjects: 0,
        persons: 0,
        threats: 0,
        vehicles: 0,
        faces: 0
      });
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const startAnalysis = async () => {
    if (!model || !faceModel || !videoRef.current) return;
    
    setIsAnalyzing(true);
    videoRef.current.play();
    setIsPlaying(true);
    detectFrame();
  };

  const detectFrame = async () => {
    if (!isAnalyzing || !videoRef.current || videoRef.current.paused) return;

    try {
      // Object detection
      const predictions = await model.detect(videoRef.current);
      
      // Face detection
      const faces = await faceModel.estimateFaces(videoRef.current, false);
      
      // Draw on canvas
      drawDetections(predictions, faces);
      
      // Update statistics
      updateStats(predictions, faces);
      
      // Check for threats
      checkThreats(predictions);
      
      setDetections(predictions);
    } catch (error) {
      console.error('Detection error:', error);
    }

    animationRef.current = requestAnimationFrame(detectFrame);
  };

  const drawDetections = (predictions, faces) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw object detections
    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox;
      
      // Color based on object type
      let color = '#3b82f6'; // Default blue
      if (prediction.class === 'person') color = '#10b981'; // Green for persons
      if (threatObjects.includes(prediction.class)) color = '#ef4444'; // Red for threats
      if (vehicleTypes.includes(prediction.class)) color = '#f59e0b'; // Orange for vehicles
      
      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label
      ctx.fillStyle = color;
      ctx.font = 'bold 16px Arial';
      const label = `${prediction.class} ${Math.round(prediction.score * 100)}%`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(x, y - 25, textWidth + 10, 25);
      ctx.fillStyle = 'white';
      ctx.fillText(label, x + 5, y - 7);
    });

    // Draw face detections
    faces.forEach(face => {
      const start = face.topLeft;
      const end = face.bottomRight;
      const size = [end[0] - start[0], end[1] - start[1]];
      
      ctx.strokeStyle = '#a855f7'; // Purple for faces
      ctx.lineWidth = 3;
      ctx.strokeRect(start[0], start[1], size[0], size[1]);
      
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 16px Arial';
      ctx.fillRect(start[0], start[1] - 25, 100, 25);
      ctx.fillStyle = 'white';
      ctx.fillText('Face', start[0] + 5, start[1] - 7);
    });
  };

  const updateStats = (predictions, faces) => {
    const persons = predictions.filter(p => p.class === 'person').length;
    const threats = predictions.filter(p => threatObjects.includes(p.class)).length;
    const vehicles = predictions.filter(p => vehicleTypes.includes(p.class)).length;
    
    setStats({
      totalObjects: predictions.length,
      persons: persons,
      threats: threats,
      vehicles: vehicles,
      faces: faces.length
    });
  };

  const checkThreats = (predictions) => {
    predictions.forEach(prediction => {
      if (threatObjects.includes(prediction.class) && prediction.score > 0.6) {
        const alertMessage = `⚠️ THREAT DETECTED: ${prediction.class.toUpperCase()} - Confidence: ${Math.round(prediction.score * 100)}%`;
        setAlerts(prev => {
          // Avoid duplicate alerts
          if (!prev.some(a => a.message === alertMessage)) {
            return [...prev.slice(-4), {
              id: Date.now(),
              message: alertMessage,
              timestamp: new Date().toLocaleTimeString(),
              severity: 'high'
            }];
          }
          return prev;
        });
      }
    });
  };

  return (
    <div className="video-analysis-container">
      <div className="analysis-layout">
        {/* Video Display */}
        <div className="video-section">
          <div className="card">
            <div className="card-header">
              <Eye className="card-icon" size={28} />
              <h2 className="card-title">Live Video Analysis</h2>
            </div>
            
            <div className="video-wrapper">
              <video
                ref={videoRef}
                src={videoSrc}
                className="video-player"
                onEnded={() => setIsPlaying(false)}
              />
              <canvas ref={canvasRef} className="detection-canvas" />
            </div>

            <div className="video-controls">
              <button className="btn btn-primary" onClick={handlePlayPause}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <button className="btn btn-success" onClick={startAnalysis} disabled={isAnalyzing}>
                <Target size={20} />
                {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
              </button>
              
              <button className="btn btn-danger" onClick={handleReset}>
                <RotateCcw size={20} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Statistics & Alerts */}
        <div className="info-section">
          {/* Real-time Statistics */}
          <div className="card stats-card">
            <h3 className="section-title">📊 Detection Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total Objects</span>
                <span className="stat-value">{stats.totalObjects}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Persons</span>
                <span className="stat-value" style={{ color: '#10b981' }}>{stats.persons}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Faces Detected</span>
                <span className="stat-value" style={{ color: '#a855f7' }}>{stats.faces}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Vehicles</span>
                <span className="stat-value" style={{ color: '#f59e0b' }}>{stats.vehicles}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Threats</span>
                <span className="stat-value" style={{ color: '#ef4444' }}>{stats.threats}</span>
              </div>
            </div>
          </div>

          {/* Alert Panel */}
          <div className="card alerts-card">
            <h3 className="section-title">
              <AlertTriangle size={20} />
              Security Alerts
            </h3>
            <div className="alerts-list">
              {alerts.length === 0 ? (
                <div className="no-alerts">
                  <Target size={40} style={{ opacity: 0.3 }} />
                  <p>No threats detected</p>
                </div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className={`alert-item ${alert.severity}`}>
                    <div className="alert-content">
                      <span className="alert-message">{alert.message}</span>
                      <span className="alert-time">{alert.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Current Detections */}
          <div className="card detections-card">
            <h3 className="section-title">
              <Target size={20} />
              Current Detections
            </h3>
            <div className="detections-list">
              {detections.length === 0 ? (
                <p className="no-detections">No objects detected</p>
              ) : (
                detections.slice(0, 10).map((det, idx) => (
                  <div key={idx} className="detection-item">
                    <span className="detection-label">{det.class}</span>
                    <span className="detection-confidence">
                      {Math.round(det.score * 100)}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysis;
