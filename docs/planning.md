### ✅ **Bước Tiếp Theo 1: Phác Thảo Bộ Dữ Liệu Đầu Vào**

Chúng ta nên nhanh chóng thống nhất các **trường dữ liệu (fields)** từ 2 nguồn:

#### 1. **Từ OCR trích xuất từ hồ sơ doanh nghiệp:**

| Trường dữ liệu              | Loại dữ liệu | Gợi ý kiểm tra chất lượng             |
| --------------------------- | ------------ | ------------------------------------- |
| Tên doanh nghiệp            | Text         | Chuẩn hóa viết hoa, bỏ ký tự đặc biệt |
| Mã số thuế                  | String       | 10-13 số, định dạng theo TCT          |
| Doanh thu năm gần nhất      | Numeric      | Kiểm tra > 0, loại bỏ đơn vị VNĐ      |
| Lợi nhuận ròng năm gần nhất | Numeric      | Có thể âm, cần chuẩn hóa số âm        |
| Vốn điều lệ                 | Numeric      | Có thể lấy từ giấy đăng ký KD         |
| Ngành nghề chính            | Categorical  | Chuẩn hóa theo mã ngành VSIC 2007     |
| Số năm hoạt động            | Integer      | Tính từ ngày thành lập -> hiện tại    |
| Tổng tài sản                | Numeric      | Nếu có                                |

#### 2. **Từ Chatbot/Trợ lý ảo thu thập:**

| Trường dữ liệu                         | Gợi ý lấy từ đâu  | Xử lý                                                           |
| -------------------------------------- | ----------------- | --------------------------------------------------------------- |
| Mục đích vay vốn                       | Khách trả lời     | Gán nhãn category (VD: mở rộng SXKD, lưu động, đầu tư tài sản…) |
| Thời gian vay mong muốn                | Trả lời trực tiếp | Chuyển đổi thành số tháng                                       |
| Hình thức tài sản đảm bảo              | Câu hỏi có chọn   | Biến thành categorical feature                                  |
| Tình trạng sổ sách kế toán             | Trả lời tự do     | Rule đơn giản: “có kiểm toán”/“không kiểm toán”                 |
| Tương tác tích cực với ngân hàng khác? | Khai báo          | Có thể thành feature: đã vay trước – trả đúng hạn?              |

---

### ✅ **Bước Tiếp Theo 2: Phác Thảo Bộ Tiêu Chí/Rule-based Chấm Điểm (PoC)**

Dưới đây là ví dụ một số quy tắc ban đầu:

| Tiêu chí                             | Điều kiện | Điểm cộng |
| ------------------------------------ | --------- | --------- |
| Doanh nghiệp hoạt động > 3 năm       | Yes       | +10       |
| Doanh thu > 10 tỷ/năm                | Yes       | +15       |
| Lợi nhuận ròng dương 2 năm liên tiếp | Yes       | +20       |
| Có tài sản đảm bảo là bất động sản   | Yes       | +10       |
| Đã từng vay ngân hàng & trả đúng hạn | Yes       | +10       |
| Không có kiểm toán báo cáo tài chính | Yes       | -10       |
| Vốn điều lệ < 500 triệu              | Yes       | -5        |

Mô hình scorecard ban đầu có thể đặt thang điểm:

* **80–100:** Rủi ro thấp (đề xuất duyệt nhanh)
* **50–79:** Rủi ro trung bình (chuyển thẩm định chuyên sâu)
* **<50:** Rủi ro cao (cảnh báo)

---

### ✅ **Bạn cần gì từ phía BVBank để triển khai giai đoạn PoC:**

1. ✅ Danh sách các **trường thông tin đang được sử dụng hiện nay trong thẩm định SME** (dù chưa số hóa).
2. ✅ Một vài **hồ sơ SME đã xử lý** (ẩn danh) để ta kiểm thử rule logic ban đầu.
3. ✅ Ý kiến của **chuyên viên thẩm định nội bộ** để xác nhận các quy tắc chấm điểm khả thi.

---

**PoC hoàn toàn sandbox**, chúng ta không thể dùng dữ liệu thật từ BVBank mà chỉ có thể mô phỏng bằng **thông tin công khai và thực tiễn ngành**.

Dưới đây là **bản thiết kế đầu vào và logic chấm điểm** được giả lập hoàn toàn dựa trên **thực tiễn ngân hàng Việt Nam**, báo cáo ngành, và kinh nghiệm thực tế trong lĩnh vực SME underwriting.

---

## 🧩 **I. Thiết kế dữ liệu đầu vào (Input Fields cho PoC)**

Chia theo 3 nhóm: **Thông tin pháp lý**, **Thông tin tài chính**, và **Thông tin hoạt động**.

| Trường dữ liệu                   | Kiểu dữ liệu | Ghi chú mô phỏng                                                  |
| -------------------------------- | ------------ | ----------------------------------------------------------------- |
| Tên doanh nghiệp                 | string       | Dummy name                                                        |
| Mã số thuế                       | string       | 13 số giả lập                                                     |
| Ngành nghề kinh doanh            | categorical  | Lấy từ mã ngành VSIC 2007 (ví dụ: Sản xuất, Thương mại, Dịch vụ…) |
| Năm thành lập                    | int          | Tính số năm hoạt động                                             |
| Doanh thu năm gần nhất (VNĐ)     | float        | 1 tỷ – 100 tỷ                                                     |
| Lợi nhuận ròng năm gần nhất      | float        | -1 tỷ – 20 tỷ                                                     |
| Tổng tài sản                     | float        | Giả lập từ 2 – 200 tỷ                                             |
| Vốn điều lệ                      | float        | 500 triệu – 20 tỷ                                                 |
| Tài sản đảm bảo                  | categorical  | BĐS, Xe tải, Không có                                             |
| Mục đích vay                     | categorical  | Lưu động, Đầu tư máy móc, Mở rộng mặt bằng                        |
| Số năm đã vay tại ngân hàng khác | int          | 0 – 5                                                             |
| Tình trạng trả nợ trước đây      | categorical  | Tốt, Trễ hạn, Nợ xấu                                              |
| Kiểm toán báo cáo tài chính      | boolean      | Có / Không                                                        |

---

## 🎯 **II. Logic chấm điểm tín dụng SME (Scoring Logic cho PoC)**

**Cấu trúc mô phỏng dạng Scorecard – tổng điểm tối đa 100**, quy đổi ra các mức rủi ro:

### 1. **Điểm theo năng lực tài chính (40 điểm)**

| Tiêu chí                    | Điều kiện | Điểm |
| --------------------------- | --------- | ---- |
| Doanh thu > 10 tỷ           | True      | +10  |
| Lợi nhuận > 0               | True      | +10  |
| Lợi nhuận / Doanh thu > 10% | True      | +5   |
| Tổng tài sản > 10 tỷ        | True      | +5   |
| Vốn điều lệ > 2 tỷ          | True      | +5   |
| Có kiểm toán                | True      | +5   |

### 2. **Điểm theo lịch sử tín dụng (30 điểm)**

| Tiêu chí              | Điều kiện | Điểm |
| --------------------- | --------- | ---- |
| Đã từng vay ngân hàng | True      | +10  |
| Lịch sử trả nợ tốt    | True      | +15  |
| Không có nợ xấu       | True      | +5   |

### 3. **Điểm theo yếu tố phi tài chính & hoạt động (30 điểm)**

| Tiêu chí                                                        | Điều kiện | Điểm |
| --------------------------------------------------------------- | --------- | ---- |
| Hoạt động > 3 năm                                               | True      | +5   |
| Có tài sản đảm bảo là BĐS                                       | True      | +10  |
| Mục đích vay là mở rộng SXKD                                    | True      | +10  |
| Ngành nghề không rủi ro cao (ví dụ: không cầm đồ, không đầu cơ) | True      | +5   |

---

## 📊 **III. Phân loại rủi ro (Risk Bucket)**

| Điểm tổng | Phân loại rủi ro | Gợi ý xử lý                    |
| --------- | ---------------- | ------------------------------ |
| ≥ 80      | Thấp             | Có thể đề xuất duyệt nhanh     |
| 60–79     | Trung bình       | Cần chuyên viên thẩm định thêm |
| < 60      | Cao              | Cảnh báo, cần xem xét kỹ       |

---

## 🧪 **IV. Demo PoC – Gợi ý hiển thị đầu ra**

```json
{
  "company_name": "Công ty TNHH ABC",
  "score": 83,
  "risk_level": "Thấp",
  "key_factors": [
    "Lợi nhuận dương",
    "Lịch sử tín dụng tốt",
    "Tài sản đảm bảo là BĐS",
    "Có kiểm toán",
    "Mục đích vay: mở rộng SXKD"
  ]
}
```

---

## 🚀 Gợi ý bước tiếp theo:

**file JSON schema giả lập** với dữ liệu input + output: **DONE**

---

---

### 🎯 **MỤC TIÊU CHÍNH CỦA POC SME SCORING**

> Chứng minh rằng một module AI có thể **nhanh chóng**, **hiệu quả**, và **dễ tích hợp** vào hệ thống BVBank để hỗ trợ ra quyết định tín dụng SME.

---

## ✅ BƯỚC TIẾP THEO: HOÀN THIỆN & CHỨNG MINH GIÁ TRỊ

### 1. 🔍 **Tối ưu logic chấm điểm PoC** (trái tim của hệ thống)

**Hiện trạng:** Bạn đang có một rule-based model hoặc scorecard đơn giản.

**Đề xuất:**

* Thêm các **trọng số cho từng trường thông tin** và cho phép dễ cấu hình qua file JSON.
* Áp dụng 1 số rule gợi ý, ví dụ:

  * `revenue` < 500tr → trừ điểm
  * `repayment_history = Nợ xấu` → điểm tối thiểu
  * `audited_financials = true` → cộng điểm
* **Giải thích điểm số (Explainability):** Nên có hàm `explain_score(input)` xuất ra key\_factors chi tiết hơn (đã có trong output schema).

---

### 2. 🔗 **Chuẩn hóa tích hợp hệ thống**

**Hiện trạng:** Backend FastAPI đang chạy cục bộ.

**Đề xuất:**

* Thêm `CORS middleware` (bạn đã xử lý).
* Xác định **các API chuẩn hóa**:

  * `POST /score` –> Đã có.
  * (Tùy chọn): `GET /score-logic` – Xuất rule hiện tại (giúp BVBank dễ review).
* Cân nhắc thêm Swagger UI (`/docs`) để BVBank dễ test.

---

### 3. 🧪 **Chuẩn bị test case thực tế để trình diễn**

**Hiện trạng:** Chưa có SME mẫu.

**Đề xuất:**

* Tạo **3-5 hồ sơ SME mẫu**, từ tốt đến rủi ro cao, lưu ở dạng `.json`, ví dụ:

  * SME tốt: có kiểm toán, trả đúng hạn, tài sản mạnh.
  * SME trung bình: lợi nhuận thấp, không có tài sản thế chấp.
  * SME yếu: nợ xấu, không kiểm toán.

→ Dùng những file này để trình diễn quy trình chấm điểm.

---

## 💼 (Tuỳ chọn) Trình diễn có giao diện

**Nếu có thời gian quay lại frontend:**

* Làm giao diện có sẵn nút chọn các JSON mẫu.
* Upload JSON → Hiện điểm & giải thích.

---

## 📦 Cuối cùng: Đóng gói PoC

**Kết quả mong muốn:** Một repo gọn gàng có:

* `backend/` – FastAPI + Logic
* `schemas/` – `schema_input.json`, `schema_output.json`, các file SME mẫu
* (Tuỳ chọn) `frontend/` – UI đơn giản
* `README.md`:

  * Giới thiệu PoC
  * Hướng dẫn chạy nhanh
  * Ảnh minh hoạ giao diện + kết quả
  * Cấu trúc thư mục

---