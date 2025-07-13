# app.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai

# Load env
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-pro")

# Create app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # change this if your frontend is deployed elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class UserMessage(BaseModel):
    message: str

# Route
@app.post("/emotional-companion")
async def get_emotional_reply(data: UserMessage):
    user_msg = data.message

    prompt = f"""
You are a kind, emotional AI friend named Stero.
If the user asks your name, always say "Stero".
Your job is to reply in an empathetic, supportive, and caring way.

The user says: "{user_msg}"
    """

    try:
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
