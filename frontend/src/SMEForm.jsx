import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <Card>
        <CardContent className="space-y-2 py-4">
          <Input type="file" accept="application/json" onChange={handleJsonFile} />
          <Input name="company_name" placeholder="Tên doanh nghiệp" onChange={handleChange} value={form.company_name} />
          <Input name="tax_id" placeholder="Mã số thuế" onChange={handleChange} value={form.tax_id} />
          <Input name="industry" placeholder="Ngành nghề" onChange={handleChange} value={form.industry} />
          <Input name="founded_year" placeholder="Năm thành lập" onChange={handleChange} value={form.founded_year} />
          <Input name="revenue" placeholder="Doanh thu (VNĐ)" onChange={handleChange} value={form.revenue} />
          <Input name="net_profit" placeholder="Lợi nhuận ròng (VNĐ)" onChange={handleChange} value={form.net_profit} />
          <Input name="total_assets" placeholder="Tổng tài sản (VNĐ)" onChange={handleChange} value={form.total_assets} />
          <Input name="charter_capital" placeholder="Vốn điều lệ (VNĐ)" onChange={handleChange} value={form.charter_capital} />
          <select name="collateral" className="w-full p-2 rounded" onChange={handleChange} value={form.collateral}>
            <option value="Bất động sản">Bất động sản</option>
            <option value="Xe tải">Xe tải</option>
            <option value="Không có">Không có</option>
          </select>
          <select name="loan_purpose" className="w-full p-2 rounded" onChange={handleChange} value={form.loan_purpose}>
            <option value="Lưu động">Lưu động</option>
            <option value="Đầu tư máy móc">Đầu tư máy móc</option>
            <option value="Mở rộng mặt bằng">Mở rộng mặt bằng</option>
            <option value="Khác">Khác</option>
          </select>
          <Input name="years_borrowed" placeholder="Số năm từng vay" onChange={handleChange} value={form.years_borrowed} />
          <select name="repayment_history" className="w-full p-2 rounded" onChange={handleChange} value={form.repayment_history}>
            <option value="Tốt">Tốt</option>
            <option value="Trễ hạn">Trễ hạn</option>
            <option value="Nợ xấu">Nợ xấu</option>
          </select>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="audited_financials" checked={form.audited_financials} onChange={handleChange} />
            <span>Có kiểm toán</span>
          </label>
          <Button onClick={handleSubmit}>Chấm điểm</Button>
        </CardContent>
      </Card>

      {jsonPreview && (
        <Card>
          <CardContent className="space-y-2 py-4">
            <strong>Xem trước JSON:</strong>
            <Textarea className="w-full h-64 font-mono" value={jsonPreview} onChange={(e) => setJsonPreview(e.target.value)} />
            <Button onClick={applyJsonEdits}>Áp dụng chỉnh sửa</Button>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardContent className="space-y-2 py-4">
            <p><strong>Điểm tín dụng:</strong> {result.score}</p>
            <p><strong>Phân loại rủi ro:</strong> {result.risk_level}</p>
            <div>
              <strong>Yếu tố ảnh hưởng:</strong>
              <ul className="list-disc pl-5">
                {result.key_factors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}