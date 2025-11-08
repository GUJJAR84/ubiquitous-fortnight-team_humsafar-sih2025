# NSG Video Intelligence - Setup Guide

## Complete Installation and Deployment Guide

This guide will help you set up the NSG Video Intelligence System from scratch.

---

## 📋 Prerequisites

### Required Software

1. **Node.js** (v18.x or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (v9.x or higher)
   - Comes with Node.js
   - Verify installation: `npm --version`

3. **Git** (for cloning repository)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: 2GB free space
- **Browser**: Chrome 90+, Firefox 88+, Edge 90+, or Safari 14+
- **Internet**: Required for initial model download

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/nsg-video-analysis.git
cd nsg-video-analysis
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

Expected output:
```
🚀 NSG Video Analysis Server running on port 5000
📁 Uploads directory: /path/to/uploads
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Access the Application

Open your browser and navigate to: **http://localhost:5173**

---

## 🔧 Detailed Setup

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install express cors multer dotenv
```

3. **Create uploads directory:**
```bash
mkdir uploads
```

4. **Start server:**
```bash
node server.js
```

**Backend Features:**
- Express.js REST API
- File upload handling with Multer
- CORS enabled for frontend communication
- In-memory storage for analysis results
- Health check endpoint

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

This will install:
- React 18
- Vite
- TensorFlow.js
- COCO-SSD model
- BlazeFace model
- Lucide React icons
- Recharts for visualizations

3. **Start development server:**
```bash
npm run dev
```

**Frontend Features:**
- React 18 with Hooks
- Vite for fast HMR (Hot Module Replacement)
- TensorFlow.js models loaded in browser
- Responsive design
- Real-time video processing

---

## 🎨 Configuration

### Backend Configuration

**File: `backend/server.js`**

```javascript
const PORT = 5000; // Change server port

// File size limit
limits: { fileSize: 100 * 1024 * 1024 } // 100MB

// Allowed file types
const allowedTypes = /mp4|avi|mov|mkv|webm/;
```

### Frontend Configuration

**File: `frontend/vite.config.js`**

```javascript
export default defineConfig({
  server: {
    port: 5173, // Change frontend port
    proxy: {
      '/api': 'http://localhost:5000' // Backend URL
    }
  }
})
```

---

## 🧪 Testing the Application

### 1. Test Video Upload

1. Go to **Video Upload** tab
2. Click or drag a video file
3. Supported formats: MP4, AVI, MOV, MKV, WEBM
4. Maximum size: 100MB
5. Click **Start AI Analysis**

### 2. Test Real-time Analysis

1. Upload a video with people, vehicles, or objects
2. Click **Start Analysis**
3. Observe bounding boxes on detected objects
4. Check statistics panel for counts
5. Watch for threat alerts (if applicable)

### 3. Test Dashboard

1. Navigate to **Dashboard** tab
2. View overall statistics
3. Check detection distribution
4. Review system information

### 4. Test Analysis History

1. Navigate to **History** tab
2. View all processed videos
3. Check detection statistics
4. Hover over threat badges for details

---

## 📦 Production Deployment

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

This creates optimized files in `frontend/dist/`

### Deploy Options

#### Option 1: Static Hosting (Frontend)

Deploy `frontend/dist/` to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

#### Option 2: Full Stack (Frontend + Backend)

**Using PM2 (Process Manager):**

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name nsg-backend

# Build and serve frontend
cd ../frontend
npm run build
pm2 serve dist 3000 --name nsg-frontend
```

**Using Docker:**

Create `Dockerfile` in root:

```dockerfile
# Backend
FROM node:18 AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
EXPOSE 5000
CMD ["node", "server.js"]

# Frontend
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Nginx to serve
FROM nginx:alpine
COPY --from=frontend /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Port Already in Use**

Error: `EADDRINUSE: address already in use :::5000`

Solution:
```bash
# Find process using port
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process or change port in server.js
```

**2. Module Not Found**

Error: `Cannot find module 'express'`

Solution:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**3. TensorFlow.js Model Loading Fails**

Error: `Failed to load model`

Solution:
- Check internet connection (models download on first use)
- Clear browser cache
- Try different browser
- Check console for specific error

**4. Video Not Playing**

Issue: Video uploads but doesn't play

Solution:
- Ensure video codec is supported (H.264 recommended)
- Check file size (must be under 100MB)
- Try different video format
- Check browser console for errors

**5. CORS Errors**

Error: `Access to XMLHttpRequest blocked by CORS policy`

Solution:
- Ensure backend CORS is enabled
- Check API URL in frontend
- Verify both servers are running

---

## 📊 Performance Optimization

### Frontend Optimization

1. **Lazy load components:**
```javascript
const Dashboard = lazy(() => import('./components/Dashboard'));
```

2. **Optimize TensorFlow.js:**
```javascript
// Use WebGL backend
await tf.setBackend('webgl');
```

3. **Video preprocessing:**
```javascript
// Reduce video resolution for faster processing
canvas.width = video.videoWidth / 2;
canvas.height = video.videoHeight / 2;
```

### Backend Optimization

1. **Enable compression:**
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add rate limiting:**
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

---

## 🔐 Security Best Practices

1. **Environment Variables**

Create `.env` file:
```env
PORT=5000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600
NODE_ENV=production
```

2. **File Upload Security**
- Validate file types
- Limit file sizes
- Sanitize filenames
- Store uploads outside web root

3. **API Security**
- Add authentication (JWT)
- Implement rate limiting
- Use HTTPS in production
- Validate all inputs

---

## 📱 Mobile Access

The application is responsive and works on mobile devices:

1. **Same Network:**
```bash
# Start with --host flag
npm run dev -- --host

# Access from mobile
http://<your-ip>:5173
```

2. **Find Your IP:**
```bash
# Mac/Linux
ifconfig | grep inet

# Windows
ipconfig
```

---

## 💾 Database Integration (Optional)

To persist data, integrate a database:

**MongoDB Example:**

```bash
npm install mongoose
```

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nsg-video-db');

const VideoSchema = new mongoose.Schema({
  filename: String,
  uploadedAt: Date,
  analysis: Object
});

const Video = mongoose.model('Video', VideoSchema);
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)
- [Express.js Documentation](https://expressjs.com/)
- [Vite Guide](https://vitejs.dev/)

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review browser console for errors
3. Check backend terminal for errors
4. Ensure all dependencies are installed
5. Verify system requirements
6. Open an issue on GitHub

---

## ✅ Verification Checklist

Before deploying or presenting:

- [ ] Backend server starts without errors
- [ ] Frontend loads successfully
- [ ] Video upload works
- [ ] AI models load correctly
- [ ] Object detection works in real-time
- [ ] Dashboard displays data
- [ ] History tab shows records
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] Performance is acceptable

---

**Last Updated:** November 2024  
**Version:** 1.0.0  
**Support:** Contact development team for assistance
