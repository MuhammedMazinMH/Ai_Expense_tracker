from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
from datetime import datetime

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    amount = Column(Float)
    category = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    payment_method = Column(String, default="Card")
    notes = Column(String, nullable=True)
