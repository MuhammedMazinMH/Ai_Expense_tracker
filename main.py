from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import models
import schemas
from database import SessionLocal, engine, Base
from ml_model import ExpenseCategorizer
import json
import traceback
import logging
from fastapi.responses import JSONResponse

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS middleware configuration - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Error creating database tables: {e}")
    raise

# Initialize ML model
try:
    categorizer = ExpenseCategorizer()
except Exception as e:
    print(f"Error initializing ML model: {e}")
    raise

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error handler caught: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

@app.get("/")
async def root():
    return {"message": "AI Expense Tracker API is running"}

@app.post("/expenses/", response_model=schemas.Expense)
async def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    try:
        # Auto-categorize expense using AI
        if not expense.category:
            expense.category = categorizer.predict(expense.description)
        
        # Parse the date string to datetime
        expense_date = datetime.strptime(expense.date, "%Y-%m-%d") if expense.date else datetime.utcnow()
        
        db_expense = models.Expense(
            description=expense.description,
            amount=expense.amount,
            category=expense.category,
            date=expense_date,
            payment_method=expense.payment_method or "Card",
            notes=expense.notes or ""
        )
        
        db.add(db_expense)
        db.commit()
        db.refresh(db_expense)
        return db_expense
    except Exception as e:
        db.rollback()
        print(f"Error creating expense: {e}")  # Log the error
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/expenses/", response_model=List[schemas.Expense])
async def get_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        logger.info(f"Getting expenses with skip={skip}, limit={limit}")
        expenses = db.query(models.Expense).order_by(models.Expense.date.desc()).offset(skip).limit(limit).all()
        logger.info(f"Found {len(expenses)} expenses")
        return expenses
    except Exception as e:
        logger.error(f"Error getting expenses: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/insights/")
async def get_insights(db: Session = Depends(get_db)):
    try:
        logger.info("Getting insights")
        expenses = db.query(models.Expense).all()
        
        total_spent = sum(expense.amount for expense in expenses)
        
        # Calculate category totals
        category_totals = {}
        for expense in expenses:
            category = expense.category
            if category in category_totals:
                category_totals[category] += expense.amount
            else:
                category_totals[category] = expense.amount
        
        logger.info(f"Generated insights: total_spent={total_spent}, categories={len(category_totals)}")
        return {
            "total_spent": total_spent,
            "category_totals": category_totals
        }
    except Exception as e:
        logger.error(f"Error getting insights: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/budget-recommendations/")
async def get_budget_recommendations(db: Session = Depends(get_db)):
    try:
        expenses = db.query(models.Expense).all()
        # Simple recommendation based on average spending
        avg_monthly = sum(expense.amount for expense in expenses) / max(1, len(expenses)) * 30
        
        return {
            "recommended_monthly_budget": avg_monthly,
            "breakdown": {
                "essentials": avg_monthly * 0.5,
                "savings": avg_monthly * 0.3,
                "discretionary": avg_monthly * 0.2
            }
        }
    except Exception as e:
        print(f"Error getting budget recommendations: {e}")  # Log the error
        raise HTTPException(status_code=500, detail=str(e))
