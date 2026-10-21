from pydantic import BaseModel

class StoryRequest(BaseModel):
    characterName: str
    genre: str
    world: str
    description: str
    steps: int