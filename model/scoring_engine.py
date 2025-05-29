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