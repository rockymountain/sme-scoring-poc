from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from model.scoring_engine import compute_score
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 👇 Thêm đoạn sau để bật CORS cho frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Cho phép frontend gọi API
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

class SMEOutput(BaseModel):
    company_name: str
    score: int
    risk_level: str
    key_factors: List[str]

@app.post("/score", response_model=SMEOutput)
def score_sme(data: SMEInput):
    return compute_score(data.dict())