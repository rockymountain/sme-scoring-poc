import { useState, useEffect } from "react";

export default function SMEForm() {
  const [form, setForm] = useState({
    company_name: "",
    tax_id: "",
    industry: "",
    founded_year: "",
    revenue: "",
    net_profit: "",
    total_assets: "",
    charter_capital: "",
    collateral: "Bất động sản",
    loan_purpose: "Lưu động",
    years_borrowed: "",
    repayment_history: "Tốt",
    audited_financials: false,
  });

  const [result, setResult] = useState(null);
  const [jsonPreview, setJsonPreview] = useState("");

  useEffect(() => {
    setJsonPreview(JSON.stringify(form, null, 2));
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleJsonFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setForm({ ...form, ...json });
      } catch (err) {
        alert("File JSON không hợp lệ");
      }
    };
    reader.readAsText(file);
  };

  const applyJsonEdits = () => {
    try {
      const updatedForm = JSON.parse(jsonPreview);
      setForm(updatedForm);
    } catch (err) {
      alert("JSON sửa trong textarea không hợp lệ");
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      founded_year: parseInt(form.founded_year),
      revenue: parseFloat(form.revenue),
      net_profit: parseFloat(form.net_profit),
      total_assets: parseFloat(form.total_assets),
      charter_capital: parseFloat(form.charter_capital),
      years_borrowed: parseInt(form.years_borrowed),
    };

    const res = await fetch("http://localhost:8000/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setResult(data);
  };

  const Field = ({ label, children }) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Tải file JSON">
          <input type="file" accept="application/json" onChange={handleJsonFile} className="w-full border rounded px-2 py-1" />
        </Field>
        <Field label="Tên doanh nghiệp">
          <input name="company_name" className="border rounded px-2 py-1" onChange={handleChange} value={form.company_name} />
        </Field>
        <Field label="Mã số thuế">
          <input name="tax_id" className="border rounded px-2 py-1" onChange={handleChange} value={form.tax_id} />
        </Field>
        <Field label="Ngành nghề">
          <input name="industry" className="border rounded px-2 py-1" onChange={handleChange} value={form.industry} />
        </Field>
        <Field label="Năm thành lập">
          <input name="founded_year" className="border rounded px-2 py-1" onChange={handleChange} value={form.founded_year} />
        </Field>
        <Field label="Doanh thu (VNĐ)">
          <input name="revenue" className="border rounded px-2 py-1" onChange={handleChange} value={form.revenue} />
        </Field>
        <Field label="Lợi nhuận ròng (VNĐ)">
          <input name="net_profit" className="border rounded px-2 py-1" onChange={handleChange} value={form.net_profit} />
        </Field>
        <Field label="Tổng tài sản (VNĐ)">
          <input name="total_assets" className="border rounded px-2 py-1" onChange={handleChange} value={form.total_assets} />
        </Field>
        <Field label="Vốn điều lệ (VNĐ)">
          <input name="charter_capital" className="border rounded px-2 py-1" onChange={handleChange} value={form.charter_capital} />
        </Field>
        <Field label="Tài sản đảm bảo">
          <select name="collateral" className="border rounded px-2 py-1" onChange={handleChange} value={form.collateral}>
            <option value="Bất động sản">Bất động sản</option>
            <option value="Xe tải">Xe tải</option>
            <option value="Không có">Không có</option>
          </select>
        </Field>
        <Field label="Mục đích vay">
          <select name="loan_purpose" className="border rounded px-2 py-1" onChange={handleChange} value={form.loan_purpose}>
            <option value="Lưu động">Lưu động</option>
            <option value="Đầu tư máy móc">Đầu tư máy móc</option>
            <option value="Mở rộng mặt bằng">Mở rộng mặt bằng</option>
            <option value="Khác">Khác</option>
          </select>
        </Field>
        <Field label="Số năm từng vay">
          <input name="years_borrowed" className="border rounded px-2 py-1" onChange={handleChange} value={form.years_borrowed} />
        </Field>
        <Field label="Lịch sử trả nợ">
          <select name="repayment_history" className="border rounded px-2 py-1" onChange={handleChange} value={form.repayment_history}>
            <option value="Tốt">Tốt</option>
            <option value="Trễ hạn">Trễ hạn</option>
            <option value="Nợ xấu">Nợ xấu</option>
          </select>
        </Field>
        <Field label="Có kiểm toán">
          <input type="checkbox" name="audited_financials" checked={form.audited_financials} onChange={handleChange} />
        </Field>
      </div>
      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Chấm điểm</button>

      {jsonPreview && (
        <div className="space-y-2">
          <strong>Xem trước JSON:</strong>
          <textarea className="w-full h-64 font-mono p-2 border rounded" value={jsonPreview} onChange={(e) => setJsonPreview(e.target.value)} />
          <button onClick={applyJsonEdits} className="px-3 py-1 bg-gray-700 text-white rounded">Áp dụng chỉnh sửa</button>
        </div>
      )}

      {result && (
        <div className="p-4 bg-green-100 rounded shadow">
          <p className="text-lg font-bold">✅ Kết quả đánh giá tín dụng:</p>
          <p><strong>Điểm tín dụng:</strong> {result.score}</p>
          <p><strong>Phân loại rủi ro:</strong> {result.risk_level}</p>

          <div className="mt-4">
            <p className="font-semibold text-green-700">✅ Điểm mạnh:</p>
            <ul className="list-disc pl-6 text-green-700">
              {result.positive_factors?.map((f, i) => (
                <li key={`pos-${i}`}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-yellow-700">⚠️ Điểm yếu:</p>
            <ul className="list-disc pl-6 text-yellow-700">
              {result.negative_factors?.map((f, i) => (
                <li key={`neg-${i}`}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
