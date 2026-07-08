import { useState } from "react";
import { useApp } from "../context/AppState";
import "./action.css";

export default function ActionApp() {
  const { products, suppliers, forecasts, updateForecast, addSupplyUpdate } = useApp();

  const [forecastForm, setForecastForm] = useState({
    product_id: "P001", month: "Jul", forecast_qty: ""
  });
  const [forecastMsg, setForecastMsg] = useState("");

  const [supplyForm, setSupplyForm] = useState({
    product_id: "P001", type: "Delay", note: ""
  });
  const [supplyMsg, setSupplyMsg] = useState("");

  function handleForecastSubmit(e) {
    e.preventDefault();
    if (!forecastForm.forecast_qty || isNaN(forecastForm.forecast_qty)) {
      setForecastMsg("error:Please enter a valid number.");
      return;
    }
    updateForecast(forecastForm.product_id, forecastForm.month, forecastForm.forecast_qty);
    setForecastMsg("success:Forecast updated successfully!");
    setForecastForm((f) => ({ ...f, forecast_qty: "" }));
    setTimeout(() => setForecastMsg(""), 3000);
  }

  function handleSupplySubmit(e) {
    e.preventDefault();
    if (!supplyForm.note.trim()) {
      setSupplyMsg("error:Please enter a note.");
      return;
    }
    addSupplyUpdate(supplyForm);
    setSupplyMsg("success:Supply update logged!");
    setSupplyForm((f) => ({ ...f, note: "" }));
    setTimeout(() => setSupplyMsg(""), 3000);
  }

  return (
    <div className="action-wrap">
      {/* Forecast Override */}
      <div className="action-card">
        <h2 className="action-title">Override Demand Forecast</h2>
        <p className="action-desc">Adjust monthly product forecast quantities. Changes reflect instantly on the Insight Dashboard.</p>
        <form onSubmit={handleForecastSubmit} className="action-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product</label>
              <select
                value={forecastForm.product_id}
                onChange={(e) => setForecastForm((f) => ({ ...f, product_id: e.target.value }))}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Month</label>
              <select
                value={forecastForm.month}
                onChange={(e) => setForecastForm((f) => ({ ...f, month: e.target.value }))}
              >
                {["May", "Jun", "Jul"].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Current Forecast</label>
              <div className="readonly-field">
                {forecasts.find(
                  (f) => f.product_id === forecastForm.product_id && f.month === forecastForm.month
                )?.forecast_qty ?? "—"}
              </div>
            </div>
            <div className="form-group">
              <label>New Forecast Qty</label>
              <input
                type="number"
                min="0"
                placeholder="Enter quantity"
                value={forecastForm.forecast_qty}
                onChange={(e) => setForecastForm((f) => ({ ...f, forecast_qty: e.target.value }))}
              />
            </div>
          </div>
          {forecastMsg && (
            <p className={`form-msg ${forecastMsg.startsWith("error") ? "error" : "success"}`}>
              {forecastMsg.split(":")[1]}
            </p>
          )}
          <button type="submit" className="submit-btn">Update Forecast</button>
        </form>
      </div>

      {/* Transit Delay Override */}
      <div className="action-card">
        <h2 className="action-title">Log Supply Update</h2>
        <p className="action-desc">Record supply disruptions, transit delays, or restocking events for any component.</p>
        <form onSubmit={handleSupplySubmit} className="action-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product</label>
              <select
                value={supplyForm.product_id}
                onChange={(e) => setSupplyForm((f) => ({ ...f, product_id: e.target.value }))}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Update Type</label>
              <select
                value={supplyForm.type}
                onChange={(e) => setSupplyForm((f) => ({ ...f, type: e.target.value }))}
              >
                {["Delay", "Restock", "Shortage", "Expedite"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: 2 }}>
              <label>Note</label>
              <input
                type="text"
                placeholder="e.g. Supplier delayed shipment by 2 weeks"
                value={supplyForm.note}
                onChange={(e) => setSupplyForm((f) => ({ ...f, note: e.target.value }))}
              />
            </div>
          </div>
          {supplyMsg && (
            <p className={`form-msg ${supplyMsg.startsWith("error") ? "error" : "success"}`}>
              {supplyMsg.split(":")[1]}
            </p>
          )}
          <button type="submit" className="submit-btn">Log Update</button>
        </form>
      </div>

      {/* Supplier Lead Time Reference */}
      <div className="action-card">
        <h2 className="action-title">Supplier Lead Time Reference</h2>
        <div className="supplier-grid">
          {suppliers.map((s) => (
            <div key={s.id} className="supplier-tile">
              <p className="supplier-name">{s.name}</p>
              <p className="supplier-lead">{s.lead_time_days} day lead time</p>
              <span className={`badge ${s.risk.toLowerCase()}`}>{s.risk} Risk</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}