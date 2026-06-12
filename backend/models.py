from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
import datetime
from database import engine

Base = declarative_base()

class Recall(Base):
    __tablename__ = "recalls"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(String, index=True)
    user_text = Column(Text)
    
    # LLM response fields
    summary_title = Column(String)
    past_events = Column(JSON)
    current_quest = Column(String)
    key_npcs_met = Column(JSON)
    last_known_location = Column(String)
    
    immediate_action = Column(String)
    short_term_goals = Column(JSON)
    tips = Column(JSON)
    warnings = Column(JSON)
    
    confidence = Column(Float)
    requires_clarification = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)
