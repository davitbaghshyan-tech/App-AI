import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import StoryRequest, GeneratedStory
from app.services.gemini import generate_story

logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/")
def root():
    return {"message": "AI Adventure API is running!"}


@app.post("/create", response_model=GeneratedStory)
def create_story(payload: StoryRequest):
    try:
        return generate_story(payload)
    except Exception as exc:
        logger.exception("Gemini story generation failed")
        raise HTTPException(
            status_code=502, detail="Could not generate the story."
        ) from exc