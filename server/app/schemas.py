from pydantic import BaseModel, Field


class StoryRequest(BaseModel):
    character_name: str = Field(min_length=1, max_length=150)
    scene: str = Field(min_length=1, max_length=3000)
    world: str = Field(min_length=1, max_length=150)
    page_count: int = Field(ge=3, le=20)
    mood: str = Field(min_length=1, max_length=100)


class GeneratedStory(BaseModel):
    title: str
    pages: list[str]