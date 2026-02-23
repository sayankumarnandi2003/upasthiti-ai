from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Upasthiti API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev only. Should be ["http://localhost:5173"] in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import students, subjects, recognition, auth, ocr

@app.get("/")
def read_root():
    return {"message": "Welcome to Upasthiti API"}

app.include_router(students.router)
app.include_router(subjects.router)
app.include_router(recognition.router)
app.include_router(auth.router)
app.include_router(ocr.router)
