import os
from typing import List, Optional
from pydantic import BaseModel
from openai import AsyncOpenAI
from games_data import GAMES
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", "dummy-key-for-local-dev"))

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
    
    completion = await client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        response_format=RecallLLMResponse,
        temperature=0.7,
        max_tokens=1000
    )
    
    return completion.choices[0].message.parsed
