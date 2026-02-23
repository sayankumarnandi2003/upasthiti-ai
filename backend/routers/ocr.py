from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    prefix="/ocr",
    tags=["ocr"]
)

# Initialize the Gemini client lazily inside the route
# to ensure it picks up the environment variable.
def get_gemini_client():
    try:
        # Re-load in case it was created or modified while server is running
        load_dotenv()
        return genai.Client()
    except Exception as e:
        print(f"Warning: Failed to initialize Gemini Client. Make sure GEMINI_API_KEY is set. Error: {e}")
        return None

@router.post("/scan-form")
async def scan_handwritten_form(file: UploadFile = File(...)):
    """
    Receives an image of a handwritten form or notebook page, 
    and uses Gemini Vision to extract Student ID, First Name, Last Name, Email, and Course Name.
    Returns structured JSON.
    """
    client = get_gemini_client()
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Client is not configured on the server.")

    try:
        # Read the image file bytes
        contents = await file.read()
        
        # Prepare the Pydantic schema for structured output (required by Gemini)
        # We manually define the schema in JSON Schema format to pass to Gemini
        json_schema = {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "The student identification tag/number"},
                "first_name": {"type": "string", "description": "The student's given first name"},
                "last_name": {"type": "string", "description": "The student's surname or family name"},
                "email": {"type": "string", "description": "The student's email address"},
                "course_name": {"type": "string", "description": "The academic course or degree program name"}
            },
            "required": ["student_id", "first_name", "last_name", "email", "course_name"]
        }

        # Call Gemini 2.5 Flash with the image
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                types.Part.from_bytes(
                    data=contents,
                    mime_type=file.content_type or 'image/jpeg',
                ),
                'You are an AI assistant helping to digitize handwritten student enrollment forms. Please look at the uploaded image of a handwritten notebook or piece of paper, and extract the student details. Return the extracted data in the exact JSON format specified by the schema. If a field is not clearly visible or missing, leave it as an empty string.'
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=json_schema,
                temperature=0.1 # Low temperature for more deterministic factual extraction
            )
        )

        # Parse the JSON string returned by Gemini into a Python dictionary
        result_json = json.loads(response.text)
        return {"status": "success", "data": result_json}

    except Exception as e:
        print(f"OCR Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process image with AI: {str(e)}")
