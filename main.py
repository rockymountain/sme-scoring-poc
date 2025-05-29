from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from model.scoring_engine import compute_score

app = FastAPI()

class SMEInput(BaseModel):
    company_name: str
    tax_id: str
    industry: str
    founded_year: int
    revenue: float
    net_profit: float
    total_assets: float
    charter_capital: float
    collateral: str
    loan_purpose: str
    years_borrowed: int
    repayment_history: str
    audited_financials: bool

class SMEOutput(BaseModel):
    company_name: str
    score: int
    risk_level: str
    key_factors: List[str]

@app.post("/score", response_model=SMEOutput)
def score_sme(data: SMEInput):
    return compute_score(data.dict())