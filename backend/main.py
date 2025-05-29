from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

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
    score: int
    risk_level: str
    key_factors: List[str]

@app.post("/score", response_model=SMEResult)
def score_sme(data: SMEInput):
    score = 100
    key_factors = []

    if data.revenue < 500_000_000:
        score -= 30
        key_factors.append("Doanh thu thấp (<500 triệu)")

    if data.net_profit < 0:
        score -= 25
        key_factors.append("Lợi nhuận âm")
    elif data.net_profit < 50_000_000:
        score -= 15
        key_factors.append("Lợi nhuận thấp")

    if data.repayment_history == "Nợ xấu":
        score -= 40
        key_factors.append("Lịch sử trả nợ: Nợ xấu")
    elif data.repayment_history == "Trễ hạn":
        score -= 20
        key_factors.append("Lịch sử trả nợ: Trễ hạn")

    if data.collateral == "Không có":
        score -= 20
        key_factors.append("Tài sản thế chấp: Không có")

    if not data.audited_financials:
        score -= 10
        key_factors.append("Không có báo cáo kiểm toán")

    score = max(0, min(score, 100))

    if score >= 70:
        risk_level = "Thấp"
    elif score >= 40:
        risk_level = "Trung bình"
    else:
        risk_level = "Cao"

    return SMEResult(
        company_name=data.company_name,
        score=score,
        risk_level=risk_level,
        key_factors=key_factors
    )
