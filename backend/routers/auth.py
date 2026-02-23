from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import schemas, database

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(creds: LoginRequest):
    # Hardcoded admin credentials for demo purposes
    # In production, use hashed passwords and verify against database
    if creds.username == "admin" and creds.password == "admin123":
        return {"access_token": "demo_admin_token", "token_type": "bearer"}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )
