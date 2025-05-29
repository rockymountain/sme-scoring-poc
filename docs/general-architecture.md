## 🚀 **Gợi ý cấu trúc thư mục cho Scoring PoC**

```
sme_scoring_poc/
├── main.py                  # FastAPI app
├── schemas/
│   ├── schema_input.json
│   └── schema_output.json
├── model/
│   └── scoring_engine.py    # Rule-based scoring logic
├── data/
│   └── sample_input.json    # Input mẫu để test
├── README.md
```

---

## 🧠 **1. `scoring_engine.py` – Rule-based logic**

```python
def compute_score(data: dict) -> dict:
    score = 0
    factors = []

    # --- Tài chính (40 điểm) ---
    if data["revenue"] > 10_000_000_000:
        score += 10
        factors.append("Doanh thu > 10 tỷ")
    if data["net_profit"] > 0:
        score += 10
        factors.append("Lợi nhuận dương")
    if data["net_profit"] / data["revenue"] > 0.1:
        score += 5
        factors.append("Biên lợi nhuận > 10%")
    if data["total_assets"] > 10_000_000_000:
        score += 5
        factors.append("Tổng tài sản > 10 tỷ")
    if data["charter_capital"] > 2_000_000_000:
        score += 5
        factors.append("Vốn điều lệ > 2 tỷ")
    if data["audited_financials"]:
        score += 5
        factors.append("Có kiểm toán")

    # --- Lịch sử tín dụng (30 điểm) ---
    if data["years_borrowed"] > 0:
        score += 10
        factors.append("Từng vay ngân hàng")
    if data["repayment_history"] == "Tốt":
        score += 15
        factors.append("Lịch sử trả nợ tốt")
    elif data["repayment_history"] == "Trễ hạn":
        score += 5
        factors.append("Từng trễ hạn")
    # Nợ xấu thì không cộng điểm

    # --- Yếu tố hoạt động (30 điểm) ---
    if 2025 - data["founded_year"] > 3:
        score += 5
        factors.append("Thành lập > 3 năm")
    if data["collateral"] == "Bất động sản":
        score += 10
        factors.append("Tài sản đảm bảo là BĐS")
    if data["loan_purpose"] == "Mở rộng mặt bằng":
        score += 10
        factors.append("Mục đích vay: mở rộng SXKD")
    if data["industry"] not in ["Cầm đồ", "Crypto", "Đầu cơ"]:
        score += 5
        factors.append("Ngành nghề ít rủi ro")

    # Phân loại rủi ro
    if score >= 80:
        risk = "Thấp"
    elif score >= 60:
        risk = "Trung bình"
    else:
        risk = "Cao"

    return {
        "company_name": data["company_name"],
        "score": score,
        "risk_level": risk,
        "key_factors": factors
    }
```

---

## ⚙️ **2. `main.py` – FastAPI App**

```python
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
```

---

## 🧪 **3. `sample_input.json` – Dữ liệu mẫu để test**

```json
{
  "company_name": "Công ty TNHH ABC",
  "tax_id": "0312345678",
  "industry": "Sản xuất",
  "founded_year": 2015,
  "revenue": 15000000000,
  "net_profit": 2500000000,
  "total_assets": 20000000000,
  "charter_capital": 5000000000,
  "collateral": "Bất động sản",
  "loan_purpose": "Mở rộng mặt bằng",
  "years_borrowed": 2,
  "repayment_history": "Tốt",
  "audited_financials": true
}
```

---
