import sys
import os

# Add current directory to path so app can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import Base, engine
from app.db import models

print("Initializing the SQLite Database...")
Base.metadata.create_all(bind=engine)
print("Database initialized successfully!")
