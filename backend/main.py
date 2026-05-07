from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
from PyPDF2 import PdfReader
from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Groq Client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

# Create uploads folder automatically
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.get("/")
def home():
    return {"message": "InterviewAI Pro Backend Running"}

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    # Save uploaded file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Read PDF
    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        extracted = page.extract_text()

        if extracted:
            text += extracted

    # AI Prompt
    prompt = f"""
    This is a candidate resume:

    {text}

    Generate 5 professional interview questions based on the resume skills.
    """

    # Generate AI response
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.1-8b-instant",
    )

    questions = chat_completion.choices[0].message.content

    return {
        "filename": file.filename,
        "interview_questions": questions
    }
@app.post("/chat/")
async def chat_with_ai(data: dict):

    user_message = data.get("message")

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """
                You are a professional AI interviewer.

                Ask technical interview questions.
                Give realistic HR interview responses.
                Keep responses short and professional.
                """
            },
            {
                "role": "user",
                "content": user_message
            }
        ],
        model="llama-3.1-8b-instant",
    )

    ai_response = chat_completion.choices[0].message.content

    return {
        "response": ai_response
    }