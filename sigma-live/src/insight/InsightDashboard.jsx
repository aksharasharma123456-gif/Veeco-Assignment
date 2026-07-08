import { useApp } from "../context/AppState";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./insight.css";
export default function InsightDashboard() {
  const { products, suppliers, inventory, forecasts, supplyUpdates } = useApp();

  // Build chart data: inventory vs demand per product for Jul
  const chartData = products.map((p) => {
    const inv = inventory.find((i) => i.product_id === p.id && i.month === "Jul");
    const dem = forecasts.find((f) => f.product_id === p.id && f.month === "Jul");
    const onHand = inv?.qty_on_hand ?? 0;
    const demand = dem?.forecast_qty ?? 0;
    return {
      name: p.name.split(" ").slice(0, 2).join(" "),
      "On Hand": onHand,
      "Forecast Demand": demand,
      shortage: demand > onHand,
    };
  });

  const shortages = chartData.filter((d) => d.shortage).length;
  const totalOnHand = inventory
    .filter((i) => i.month === "Jul")
    .reduce((s, i) => s + i.qty_on_hand, 0);
  const totalDemand = forecasts
    .filter((f) => f.month === "Jul")
    .reduce((s, f) => s + f.forecast_qty, 0);
  const fillRate = Math.round((totalOnHand / totalDemand) * 100);

  const highRiskSuppliers = suppliers.filter((s) => s.risk === "High");

  return (
    <div className="insight-wrap">
      {/* KPI Cards */}
      <div className="kpi-row">
        <div className="kpi-card">
          <p className="kpi-label">Fill Rate (Jul)</p>
          <p className={`kpi-value ${fillRate < 80 ? "danger" : "safe"}`}>{fillRate}%</p>
          <p className="kpi-sub">inventory vs demand</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Components at Shortage Risk</p>
          <p className={`kpi-value ${shortages > 0 ? "danger" : "safe"}`}>{shortages}</p>
          <p className="kpi-sub">demand exceeds supply</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">High Risk Suppliers</p>
          <p className="kpi-value danger">{highRiskSuppliers.length}</p>
          <p className="kpi-sub">{highRiskSuppliers.map((s) => s.name).join(", ")}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Supply Updates Logged</p>
          <p className="kpi-value safe">{supplyUpdates.length}</p>
          <p className="kpi-sub">via Action Panel</p>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-card">
        <h2 className="section-title">Inventory vs Forecast Demand — July</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#1e2535", border: "1px solid #2d3748", borderRadius: 8 }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
            <Bar dataKey="On Hand" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Forecast Demand" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Supplier Bottleneck Table */}
      <div className="table-card">
        <h2 className="section-title">Supplier Bottleneck Overview</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Lead Time</th>
              <th>Risk Level</th>
              <th>Components</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.lead_time_days} days</td>
                <td>
                  <span className={`badge ${s.risk.toLowerCase()}`}>{s.risk}</span>
                </td>
                <td>
                  {products
                    .filter((p) => p.supplier_id === s.id)
                    .map((p) => p.name)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Supply Updates */}
      {supplyUpdates.length > 0 && (
        <div className="table-card">
          <h2 className="section-title">Recent Supply Updates</h2>
          <table className="data-table">
            <thead>
              <tr><th>Type</th><th>Product</th><th>Note</th><th>Logged At</th></tr>
            </thead>
            <tbody>
              {supplyUpdates.map((u) => (
                <tr key={u.id}>
                  <td><span className="badge medium">{u.type}</span></td>
                  <td>{products.find((p) => p.id === u.product_id)?.name}</td>
                  <td>{u.note}</td>
                  <td>{new Date(u.ts).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}