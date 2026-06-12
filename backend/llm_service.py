import os
from typing import List, Optional
from pydantic import BaseModel
import google.generativeai as genai
from games_data import GAMES
from dotenv import load_dotenv
import json

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Fetch available models to find the correct one
for m in genai.list_models():
  if 'generateContent' in m.supported_generation_methods:
    print(f"Available model: {m.name}")

# Try the standard flash model
model = genai.GenerativeModel('models/gemini-2.5-flash')

class Summary(BaseModel):
    title: str
    pastEvents: List[str]
    currentQuest: str
    keyNPCsMet: List[str]
    lastKnownLocation: str

class NextSteps(BaseModel):
    immediateAction: str
    shortTermGoals: List[str]
    tips: List[str]
    warnings: List[str]

class RecallLLMResponse(BaseModel):
    summary: Summary
    nextSteps: NextSteps
    confidence: float
    requiresClarification: Optional[str] = None

async def generate_recall(game_id: str, user_text: str) -> RecallLLMResponse:
    game = GAMES.get(game_id)
    if not game:
        raise ValueError(f"Game {game_id} not found")
        
    system_prompt = game["systemPrompt"]
    user_prompt = f"Here is what I remember:\n\n{user_text}"
    
    response = model.generate_content(
        f"SYSTEM INSTRUCTIONS:\n{system_prompt}\n\nUSER PROMPT:\n{user_prompt}",
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            temperature=0.7,
        )
    )
    
    # parse the content using JSON
    content = response.text
    try:
        # Extract json part if it's wrapped in markdown code blocks
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
            
        parsed_dict = json.loads(content)
        return RecallLLMResponse(**parsed_dict)
    except Exception as e:
        raise ValueError(f"Failed to parse LLM response: {e}\nContent: {content}")
