import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_score_high_risk():
    response = client.post("/score", json={
        "company_name": "ABC Ltd",
        "tax_id": "1234567890",
        "industry": "Vận tải",
        "founded_year": 2019,
        "revenue": 400_000_000,
        "net_profit": 20_000_000,
        "total_assets": 600_000_000,
        "charter_capital": 500_000_000,
        "collateral": "Không có",
        "loan_purpose": "Lưu động",
        "years_borrowed": 2,
        "repayment_history": "Trễ hạn",
        "audited_financials": False
    })
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert "risk_level" in data
    assert data["risk_level"] == "Cao"

def test_score_low_risk():
    response = client.post("/score", json={
        "company_name": "XYZ Corp",
        "tax_id": "0987654321",
        "industry": "Công nghệ",
        "founded_year": 2012,
        "revenue": 3_000_000_000,
        "net_profit": 800_000_000,
        "total_assets": 10_000_000_000,
        "charter_capital": 5_000_000_000,
        "collateral": "Bất động sản",
        "loan_purpose": "Đầu tư máy móc",
        "years_borrowed": 5,
        "repayment_history": "Tốt",
        "audited_financials": True
    })
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] == "Thấp"
    assert data["score"] > 80