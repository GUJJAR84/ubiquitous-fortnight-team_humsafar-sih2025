const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /mp4|avi|mov|mkv|webm/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'));
        }
    }
});

// In-memory storage for analysis results
const analysisResults = new Map();

// Upload video endpoint
app.post('/api/upload', upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        const videoId = Date.now().toString();
        const videoData = {
            id: videoId,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            uploadedAt: new Date().toISOString(),
            status: 'uploaded'
        };

        analysisResults.set(videoId, videoData);

        res.json({
            success: true,
            videoId: videoId,
            message: 'Video uploaded successfully',
            data: videoData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save analysis results endpoint
app.post('/api/analysis/:videoId', (req, res) => {
    try {
        const { videoId } = req.params;
        const analysisData = req.body;

        if (!analysisResults.has(videoId)) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const videoData = analysisResults.get(videoId);
        videoData.analysis = analysisData;
        videoData.status = 'analyzed';
        videoData.analyzedAt = new Date().toISOString();

        analysisResults.set(videoId, videoData);

        res.json({
            success: true,
            message: 'Analysis saved successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get analysis results endpoint
app.get('/api/analysis/:videoId', (req, res) => {
    try {
        const { videoId } = req.params;

        if (!analysisResults.has(videoId)) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const videoData = analysisResults.get(videoId);
        res.json({
            success: true,
            data: videoData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all analysis history
app.get('/api/history', (req, res) => {
    try {
        const history = Array.from(analysisResults.values()).reverse();
        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 NSG Video Analysis Server running on port ${PORT}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
});
