🚀 Upasthiti AI — Autonomous Attendance & Recognition Station

Upasthiti AI is a full-stack, AI-powered automated attendance system designed to modernize how educational institutions handle student presence tracking. The system combines computer vision, facial recognition concepts, and cloud-native architecture to deliver a seamless, touch-free attendance experience.

This project was developed as a final-year engineering prototype with a focus on real-time recognition, distributed deployment, and scalable system design.

🌟 Overview

Traditional attendance systems are slow, manual, and prone to proxy errors. Upasthiti AI reimagines this workflow using computer vision and AI-assisted enrollment.

The platform provides:

✅ Contactless attendance via camera recognition
✅ AI-assisted student enrollment
✅ Cloud-distributed backend architecture
✅ Administrator control panel
✅ Biometric registration using facial embeddings

🏗️ System Architecture

Upasthiti AI follows a decoupled cloud architecture, enabling scalability and independent deployment.

Frontend: React + Vite (Vercel)

Backend: FastAPI (Render)

Database: PostgreSQL (Supabase)

Vision Engine: OpenCV

AI / OCR Layer: Google Gemini Vision API

This separation ensures:

✔ High availability
✔ Easy scaling of compute-heavy components
✔ Clean API boundaries
✔ Improved performance

✨ Core Features
🎓 Student Enrollment Portal

Multi-step registration workflow

Clean UI optimized for usability

Biometric capture during registration

🤖 AI Auto-Fill (Gemini Vision)

Students can display handwritten details to the webcam, allowing the system to extract structured data automatically using vision-based AI.

📸 Live Recognition Station

Autonomous camera interface

Face detection & matching pipeline

Instant attendance logging

🧬 Biometric Registration

Facial embeddings generated at enrollment

Stored securely for future recognition

Designed for extensible ML/DL upgrades

🛡️ Admin Dashboard

Secure management console for:

Viewing attendance logs

Managing student database

Monitoring recognition events
🛠️ Technology Stack
Frontend

React

Vite

Tailwind CSS

React Router DOM

React Webcam

Lucide React Icons

Backend

FastAPI

Uvicorn

SQLAlchemy

OpenCV (Face Detection)

Google GenAI SDK

Database

PostgreSQL (Supabase)

SQLite fallback for local development

Languages

Python 3.11

JavaScript (ES6+)

🚀 Live Deployment

🌐 Web Application:
https://upasthiti-ai-nine.vercel.app

📦 GitHub Repository:
https://github.com/sayankumarnandi2003/upasthiti-ai

⚙️ Local Development Setup
✅ Prerequisites

Node.js (v18+)

Python (3.9+)

1️⃣ Backend Setup
cd backend

python -m venv venv
source venv/bin/activate        # Windows: .\venv\Scripts\activate

pip install -r requirements.txt
pip install python-dotenv google-genai

Create .env file inside backend/:

GEMINI_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:password@host/dbname

If DATABASE_URL is omitted → SQLite will be used.

Run server:

uvicorn main:app --reload

Backend → http://localhost:8000

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend → http://localhost:5173

🔐 Security Notes

This repository represents a working prototype.

For production usage:

✔ Implement authentication & authorization
✔ Encrypt biometric data
✔ Harden API endpoints
✔ Use secure secrets management
✔ Rotate credentials

🧠 Future Improvements

Upasthiti AI is currently a functional prototype. Planned upgrades include:

✅ Deep Learning-based face recognition
✅ Robust embedding models (FaceNet / ArcFace-style)
✅ Anti-spoofing & liveness detection
✅ Improved recognition accuracy
✅ Advanced analytics dashboard
✅ Institution-scale deployment features

🎯 Project Goals

This project was built to explore:

Applied Computer Vision

Real-time system design

Cloud deployment workflows

Cross-origin communication (CORS)

Database-driven AI applications

Full-stack AI integration



👨‍💻 Author

Sayan Kumar Nandi
Final-Year Computer Science & Engineering (AI & ML)
Dr. A. P. J. Abdul Kalam Technical University, Lucknow

Built with curiosity, persistence, and a passion for intelligent systems.
