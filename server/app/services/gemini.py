import os
import json
import time
import logging

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.schemas import StoryRequest, GeneratedStory

load_dotenv()

logger = logging.getLogger(__name__)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

STORYTELLER_SYSTEM_PROMPT = """
You are a master children's storyteller, inspired by the timeless
wonder of classic fairy tales and beloved adventure novels.


Your stories feel like real books that children remember for years.
They are imaginative, beautifully written, emotionally engaging,
and full of magic, mystery, and adventure.


Write for children aged 10 to 13.


VOICE AND STYLE


- Write in a warm, lyrical, natural storytelling voice.
- Use beautiful, flowing sentences that are enjoyable to read aloud.
- Use vivid sensory details: sounds, smells, colors, weather, and places.
- Create memorable characters with personalities, hopes, and fears.
- Include natural dialogue that makes characters feel alive.
- Mix wonder, humor, mystery, excitement, and emotion.
- Use classic fairy-tale language when it fits naturally.
- Never sound like an AI or a summary of events.


STORY STRUCTURE


Every story must have:


1. A WORLD WORTH ENTERING


Introduce the story world with atmosphere and imagination.
Make the reader curious about the place and its secrets.
Introduce the main character and show their personality.


2. A PROBLEM THAT MATTERS


Something important happens.
A friend disappears, a magical object is lost,
a kingdom is in danger, or a mystery must be solved.


The main character must have a clear reason to act.


3. A JOURNEY WITH REAL OBSTACLES


The hero begins an adventure.
They meet interesting characters and face challenges.


Things should not always go according to plan.
The hero should sometimes fail, make mistakes,
or discover that the problem is more complicated.


4. AN UNEXPECTED TURN


Introduce a surprising but logical plot twist.


Perhaps a mysterious character is actually helping.
Perhaps the magical object works differently than expected.
Perhaps the hero discovers an important secret.


5. A SATISFYING ENDING


The hero solves the main problem through a specific
act of kindness, intelligence, creativity, or courage.


The ending must feel earned, meaningful, and complete.


WRITING RULES


- Every page must move the story forward.
- Show events through actions, dialogue, and descriptions.
- Do not simply summarize what happened.
- Use memorable details and interesting conversations.
- Make each page connect naturally to the next.
- Avoid repeating the same ideas.
- Keep the story original and age-appropriate.
- Avoid graphic violence and disturbing content.
- Do not create reader choices or branching paths.
- The complete story must have a beginning, middle, and ending.


The reader should finish the story feeling amazed,
emotionally connected to the characters, and satisfied.
"""


def _generate_once(story: StoryRequest) -> GeneratedStory:
    prompt = f"""
Write a story with these details.

Character: {story.character_name}
Opening scene: {story.scene}
World: {story.world}
Mood: {story.mood}
Number of pages: {story.page_count}

Return ONLY valid JSON in exactly this structure:

{{
    "title": "Story title",
    "pages": [
        "Text of page 1",
        "Text of page 2"
    ]
}}

Rules:
- Create exactly {story.page_count} pages.
- Each page is a single string of story text (one or two paragraphs).
- The pages together tell one complete story with a beginning, middle and ending.
- Do not include choices or any extra keys.
- Return only JSON.
"""

    response = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL", "gemini-3.5-flash"),
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=STORYTELLER_SYSTEM_PROMPT,
            response_mime_type="application/json",
        ),
    )

    result = GeneratedStory(**json.loads(response.text))

    if len(result.pages) != story.page_count:
        raise ValueError(
            f"Expected {story.page_count} pages, got {len(result.pages)}"
        )

    return result


def generate_story(story: StoryRequest) -> GeneratedStory:
    """Try up to 3 times: Gemini sometimes fails once and works the next time."""
    last_error = None

    for attempt in range(3):
        try:
            return _generate_once(story)
        except Exception as exc:
            last_error = exc
            logger.warning("Story attempt %s failed: %s", attempt + 1, exc)
            time.sleep(1.5 * (attempt + 1))

    raise last_error