# Deployment Guide for Upasthiti AI

Now that your project is connected to a cloud database (Supabase) and pushed to GitHub, you can easily host it online for free so anyone in the world can access it!

We will deploy the application in two parts:
1. **Backend (FastAPI)**: Hosted on Render.com
2. **Frontend (React)**: Hosted on Vercel.com

---

## Part 1: Deploying the Backend on Render

Render is excellent for hosting Python APIs.

1. Go to [Render.com](https://render.com/) and sign in with your GitHub account.
2. Click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository**.
4. Connect your GitHub account and select your `upasthiti-ai` repository.
5. Fill out the deployment settings:
    *   **Name**: `upasthiti-api` (or whatever you like)
    *   **Root Directory**: `backend` (This is crucial!)
    *   **Environment**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Scroll down to **Advanced** -> **Environment Variables** and add your secrets:
    *   **Key**: `GEMINI_API_KEY` | **Value**: `[Paste your Gemini Key]`
    *   **Key**: `DATABASE_URL` | **Value**: `[Paste your Supabase URL from your .env]`
7. Click **Create Web Service**. 
8. Wait a few minutes for Render to build your API. Once it's live, copy the new URL they give you (e.g., `https://upasthiti-api-xxxxx.onrender.com`).

---

## Part 2: Deploying the Frontend on Vercel

Vercel is the easiest way to host React applications.

1. **Crucial Update Before Deploying**: Open your local code and replace `http://localhost:8000` with your new Render URL.
    *   In `frontend/src/pages/PublicRegistration.jsx`, update the `axios.post` URLs.
    *   In `frontend/src/pages/Login.jsx`, update the login URL.
    *   In `frontend/src/pages/LiveRecognition.jsx`, update the verification URL.
    *   In `frontend/src/pages/Students.jsx`, update the fetch students URL.
2. After updating those URLs, commit your changes and push them to GitHub:
    ```bash
    git add .
    git commit -m "Update API URLs for production"
    git push origin master
    ```
3. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
4. Click **Add New** -> **Project**.
5. Import your `upasthiti-ai` GitHub repository.
6. In the configuration settings:
    *   **Framework Preset**: It should automatically detect `Vite`.
    *   **Root Directory**: Click "Edit" and change it to `frontend` (Crucial!).
7. Click **Deploy**.

Vercel will build your React app in seconds and give you a live `.vercel.app` URL.

You can now share that URL with anyone, and they can use the Upasthiti AI prototype!
