from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Get the current directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Create the database file in the current directory
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'expenses.db')}"

try:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=True  # This will log all SQL commands
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
except Exception as e:
    print(f"Error creating database engine: {e}")
    raise
