from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import cv2
import numpy as np
import json
import crud, models, schemas
from database import get_db

router = APIRouter(
    prefix="/recognition",
    tags=["recognition"]
)

def process_image(file: UploadFile) -> np.ndarray:
    try:
        contents = file.file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file")

@router.post("/register/{student_id}")
async def register_face(student_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Registers a face for an existing student. (Prototype: Simple Mock)
    """
    student = crud.get_student(db, student_id=student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    img = process_image(file)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Load OpenCV default Haar cascade for face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    if len(faces) == 0:
        raise HTTPException(status_code=400, detail="No face detected in the image. Please try again.")
    if len(faces) > 1:
        raise HTTPException(status_code=400, detail="Multiple faces detected. Please ensure only one face is in frame.")
        
    # Mock embedding for prototype: generating a random 128-dimensional vector
    embedding = np.random.rand(128).tolist()
    embedding_str = json.dumps(embedding)
    
    # Save to DB
    db_embedding = models.StudentEmbedding(student_id=student_id, embedding_data=embedding_str)
    db.add(db_embedding)
    db.commit()
    db.refresh(db_embedding)
    
    return {"status": "success", "message": "Face registered successfully (Mock logic)."}

@router.post("/verify")
async def verify_face(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Identifies a student from a live capture and marks attendance. (Prototype: Simple Mock)
    """
    img = process_image(file)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    if len(faces) == 0:
        raise HTTPException(status_code=400, detail="No face detected in frame.")

    # Fetch all standard embeddings
    stored_embeddings = db.query(models.StudentEmbedding).all()
    if not stored_embeddings:
        raise HTTPException(status_code=404, detail="No registered students found in database. Please register first.")
        
    # MOCK LOGIC: For the prototype, if a face is detected, we randomly pick a registered user or the first one.
    # Selecting the first registered student for consistent demo success.
    best_match_emb = stored_embeddings[-1] # Pick the most recently registered student
    best_match = best_match_emb.student
    min_distance = 4.2 # Mock good distance
    
    # Fetch the first subject for demo purposes
    subject = db.query(models.Subject).first()
    subject_id = subject.id if subject else None
    
    log = models.AttendanceLog(
        student_id=best_match.id,
        subject_id=subject_id,
        status="Present",
        confidence_score=float(min_distance)
    )
    db.add(log)
    db.commit()
    
    return {
        "status": "success", 
        "student": {
            "id": best_match.student_id,
            "name": f"{best_match.first_name} {best_match.last_name}"
        },
        "distance": min_distance,
        "message": "Recognized Successfully (Mock prototype)"
    }
