import os
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from database.config import engine, Base

# Import all models so they register with the SQLAlchemy Base metadata
from database.models import core_models, workflow_models, governance_models

def initialize_database():
    print(f"Creating database schema at {engine.url}...")
    
    # Drop all existing tables (for development reset)
    # Base.metadata.drop_all(bind=engine)
    
    # Create all tables according to the imported models
    Base.metadata.create_all(bind=engine)
    
    print("Database tables created successfully!")

if __name__ == "__main__":
    initialize_database()
