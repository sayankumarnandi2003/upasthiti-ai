# Upasthiti AI - Automated Attendance System

Upasthiti AI is a modern, web-based automated attendance system designed for educational institutions. It features dual interfaces: a public-facing portal for student enrollment and live biometric scanning, and a secure administrator dashboard for managing records.

## Key Features

*   **Public Enrollment Portal:** A user-friendly, multi-step registration form for new students.
*   **AI Auto-Fill:** Powered by Google's Gemini Vision API, allowing students to hold up handwritten details to the webcam to instantly auto-fill the enrollment form.
*   **Live Recognition Station:** An autonomous camera interface that detect faces to log attendance seamlessly.
*   **Secure Admin Dashboard:** A protected console (default credentials: `admin` / `admin123`) to view attendance logs and manage the student catalog.
*   **Biometric Registration:** Captures and securely stores facial embeddings for future recognition.

## Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS, Lucide React, React-Router-DOM, React-Webcam
*   **Backend:** FastAPI, Uvicorn, SQLAlchemy, OpenCV (Haar Cascades for face detection), Google GenAI SDK
*   **Database:** SQLite

## Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)

### 1. Backend Setup

1.  Navigate into the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    pip install python-dotenv google-genai
    ```
4.  Configure Environment Variables:
    *   Create a `.env` file in the `backend/` directory.
    *   Add your Gemini API Key. **(Crucial: The `.env` file is git-ignored and should never be committed to the repository to keep your key secure).**
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
5.  Run the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

### 2. Frontend Setup

1.  Navigate into the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Application Structure

*   `Public Mode (`/attendance`, `/register`)`: Open to everyone for live scanning and enrollment.
*   `Admin Mode (`/admin`, `/admin/students`)`: Protected routes for authorized personnel.

---
*made with love by SAYAN*
