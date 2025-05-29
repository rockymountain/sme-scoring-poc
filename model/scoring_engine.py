import json
from pathlib import Path

# Load scoring rules from external JSON
CONFIG_PATH = Path(__file__).resolve().parent.parent / "config" / "scoring_rules.json"
with open(CONFIG_PATH, encoding="utf-8") as f:
    RULES = json.load(f)


def normalize(value, base):
    return min(value / base, 1.0)


def score_sme(data):
    weights = RULES["weights"]
    norm = RULES["normalizer"]
    history_scores = RULES["repayment_history_scores"]
    audited_bonus = RULES["audited_bonus"]

    components = {}

    # Numeric fields
    components["revenue"] = normalize(data["revenue"], norm["revenue"]) * 100
    components["net_profit"] = normalize(data["net_profit"], norm["net_profit"]) * 100
    components["total_assets"] = normalize(data["total_assets"], norm["total_assets"]) * 100
    components["charter_capital"] = normalize(data["charter_capital"], norm["charter_capital"]) * 100

    # Categorical fields
    components["repayment_history"] = history_scores.get(data["repayment_history"], 0)
    components["audited_financials"] = audited_bonus if data["audited_financials"] else 0

    # Weighted sum
    total_score = sum(components[k] * weights.get(k, 0) for k in components)

    # Risk level logic (mới)
    if total_score >= 90:
        risk_level = "Thấp"
    elif total_score >= 80:
        risk_level = "Trung bình"
    elif total_score >= 60:
        risk_level = "Cao"
    else:
        risk_level = "Rất Cao"

    # Explainable AI: phân tích điểm mạnh/yếu
    positive_factors = []
    negative_factors = []
    for k in components:
        point = components[k]
        label = k.replace('_', ' ').capitalize()
        detail = f"{label}: {point:.1f} điểm (trọng số {weights.get(k, 0):.2f})"
        if point > 50: # Đánh giá theo điểm
            positive_factors.append(detail)
        else:
            negative_factors.append(detail)

    return {
        "score": round(total_score, 1),
        "risk_level": risk_level,
        "positive_factors": positive_factors,
        "negative_factors": negative_factors,
        "key_factors": positive_factors + negative_factors
    }
