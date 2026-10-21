import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_story(
   characterName: str,
   genre: str,
   world: str,
   description: str,
   steps: int,
):
   prompt = f"""
   Create an interactive adventure story.


   Character: {characterName}
   Genre: {genre}
   World: {world}
   Description: {description}
   Number of scenes: {steps}


   The story should be magical, creative,
   and suitable for teenagers.


   Return ONLY valid JSON in this structure:


   {{
       "title": "Story title",
       "scenes": [
           {{
               "text": "Story scene text",
               "choices": [
                   "First choice",
                   "Second choice",
                   "Third choice"
               ]
           }}
       ]
   }}


   Rules:
   - Create exactly {steps} scenes.
   - Each scene should have 2 or 3 choices.
   - Make the story coherent.
   - Return only JSON.
   """


   response = client.interactions.create(
       model="gemini-3.5-flash-lite",
       input=prompt,
   )


   return json.loads(response.output_text)