from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import database
import games_data
import llm_service

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Recall Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/games", response_model=schemas.GamesResponse)
def get_games():
    games = games_data.get_all_game_info()
    return {
        "success": True,
        "data": {
            "games": games
        }
    }

@app.post("/api/recall", response_model=schemas.RecallResponse)
async def create_recall(request: schemas.RecallRequest, db: Session = Depends(get_db)):
    game = games_data.GAMES.get(request.gameId)
    if not game:
        raise HTTPException(status_code=400, detail=f"Game '{request.gameId}' not found")
        
    try:
        llm_response = await llm_service.generate_recall(request.gameId, request.userText)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process with AI: {str(e)}")

    db_recall = models.Recall(
        game_id=request.gameId,
        user_text=request.userText,
        summary_title=llm_response.summary.title,
        past_events=llm_response.summary.pastEvents,
        current_quest=llm_response.summary.currentQuest,
        key_npcs_met=llm_response.summary.keyNPCsMet,
        last_known_location=llm_response.summary.lastKnownLocation,
        immediate_action=llm_response.nextSteps.immediateAction,
        short_term_goals=llm_response.nextSteps.shortTermGoals,
        tips=llm_response.nextSteps.tips,
        warnings=llm_response.nextSteps.warnings,
        confidence=llm_response.confidence,
        requires_clarification=llm_response.requiresClarification
    )
    db.add(db_recall)
    db.commit()
    db.refresh(db_recall)
    
    return {
        "success": True,
        "data": {
            "gameId": request.gameId,
            "gameName": game["name"],
            "summary": {
                "title": llm_response.summary.title,
                "pastEvents": llm_response.summary.pastEvents,
                "currentQuest": llm_response.summary.currentQuest,
                "keyNPCsMet": llm_response.summary.keyNPCsMet,
                "lastKnownLocation": llm_response.summary.lastKnownLocation
            },
            "nextSteps": {
                "immediateAction": llm_response.nextSteps.immediateAction,
                "shortTermGoals": llm_response.nextSteps.shortTermGoals,
                "tips": llm_response.nextSteps.tips,
                "warnings": llm_response.nextSteps.warnings
            },
            "confidence": llm_response.confidence,
            "requiresClarification": llm_response.requiresClarification
        }
    }

@app.get("/api/archives", response_model=schemas.ArchivesResponse)
def get_archives(db: Session = Depends(get_db)):
    recalls = db.query(models.Recall).order_by(models.Recall.created_at.desc()).all()
    
    archives = []
    for r in recalls:
        game = games_data.GAMES.get(r.game_id)
        game_name = game["name"] if game else "Unknown Game"
        
        archives.append({
            "id": str(r.id),
            "gameId": r.game_id,
            "gameName": game_name,
            "userText": r.user_text,
            "summary": r.summary_title,
            "createdAt": r.created_at.isoformat() + "Z"
        })
        
    return {
        "success": True,
        "data": {
            "archives": archives
        }
    }
