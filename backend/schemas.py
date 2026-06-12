from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class GameInfoResponse(BaseModel):
    id: str
    name: str
    coverImage: str
    supported: bool

class GamesResponseData(BaseModel):
    games: List[GameInfoResponse]

class GamesResponse(BaseModel):
    success: bool
    data: GamesResponseData

class RecallRequest(BaseModel):
    gameId: str = Field(..., min_length=1)
    userText: str = Field(..., min_length=10, max_length=2000)

class SummaryResponse(BaseModel):
    title: str
    pastEvents: List[str]
    currentQuest: str
    keyNPCsMet: List[str]
    lastKnownLocation: str

class NextStepsResponse(BaseModel):
    immediateAction: str
    shortTermGoals: List[str]
    tips: List[str]
    warnings: List[str]

class RecallResponseData(BaseModel):
    gameId: str
    gameName: str
    summary: SummaryResponse
    nextSteps: NextStepsResponse
    confidence: float
    requiresClarification: Optional[str] = None

class RecallResponse(BaseModel):
    success: bool
    data: RecallResponseData

class ErrorDetails(BaseModel):
    code: str
    message: str
    details: Optional[str] = None
    retryable: Optional[bool] = None

class ErrorResponse(BaseModel):
    success: bool
    error: ErrorDetails

class ArchiveItem(BaseModel):
    id: str
    gameId: str
    gameName: str
    userText: str
    summary: str
    createdAt: str

class ArchivesResponseData(BaseModel):
    archives: List[ArchiveItem]

class ArchivesResponse(BaseModel):
    success: bool
    data: ArchivesResponseData
