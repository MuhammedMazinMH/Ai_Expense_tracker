from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional

class ExpenseBase(BaseModel):
    description: str
    amount: float
    category: Optional[str] = None
    date: Optional[str] = None
    payment_method: Optional[str] = "Card"
    notes: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int
    date: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

    @validator('date', pre=True)
    def parse_date(cls, value):
        if isinstance(value, str):
            return datetime.fromisoformat(value.replace('Z', '+00:00'))
        return value
