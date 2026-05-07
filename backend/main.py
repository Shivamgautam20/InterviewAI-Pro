from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

from groq import Groq

import os
import fitz

# Load .env
load_dotenv()

# Groq Client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload Resume API
@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):

    # Save uploaded file temporarily
    contents = await file.read()

    with open(file.filename, "wb") as f:
        f.write(contents)

    # Read PDF
    text = ""

    pdf = fitz.open(file.filename)

    for page in pdf:
        text += page.get_text()

    # AI Prompt
    prompt = f"""
    Analyze this resume and generate 5 professional interview questions.

    Resume:
    {text}
    """

    # Groq AI
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama-3.1-8b-instant",
    )

    questions = chat_completion.choices[0].message.content

    return {
        "filename": file.filename,
        "interview_questions": questions
    }

# AI Chat API
@app.post("/chat/")
async def ai_chat(data: dict):

    user_message = data.get("message")

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a professional AI interviewer."
            },
            {
                "role": "user",
                "content": user_message
            }
        ],
        model="llama-3.1-8b-instant",
    )

    response = chat_completion.choices[0].message.content

    return {
        "response": response
    }