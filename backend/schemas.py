from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SubjectBase(BaseModel):
    subject_code: str
    subject_name: str

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int

    class Config:
        from_attributes = True

class StudentBase(BaseModel):
    student_id: str
    first_name: str
    last_name: str
    email: str
    course_name: str

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int
    registration_date: datetime

    class Config:
        from_attributes = True

class AttendanceLogBase(BaseModel):
    status: str
    confidence_score: float

class AttendanceLogCreate(AttendanceLogBase):
    student_id: int
    subject_id: int

class AttendanceLog(AttendanceLogBase):
    id: int
    timestamp: datetime
    student_id: int
    subject_id: int

    class Config:
        from_attributes = True
