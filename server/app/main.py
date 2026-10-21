from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import StoryRequest
from app.services.gemini import generate_story

app = FastAPI()

# lets the Next.js frontend (localhost:3000) call this backend from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "AI Adventure API is running!"}


@app.post("/create")
def create_story(story: StoryRequest):
    result = generate_story(
        characterName=story.characterName,
        genre=story.genre,
        world=story.world,
        description=story.description,
        steps=story.steps,
    )

    return {
        "story": result
    }
