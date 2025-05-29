from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from model.scoring_engine import score_sme as core_score

app = FastAPI()

# Bật CORS để frontend kết nối được
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class SMEResult(BaseModel):
    company_name: str
    score: float
    risk_level: str
    key_factors: List[str]

@app.post("/score", response_model=SMEResult)
def score_sme(data: SMEInput):
    result = core_score(data.dict())
    return SMEResult(
        company_name=data.company_name,
        score=result["score"],
        risk_level=result["risk_level"],
        key_factors=result["key_factors"]
    )