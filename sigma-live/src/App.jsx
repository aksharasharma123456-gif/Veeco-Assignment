import { useState } from "react";
import InsightDashboard from "./insight/InsightDashboard";
import ActionApp from "./action/ActionApp";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("insight");

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-dot" />
          <span className="brand-name">Sigma Live</span>
          <span className="brand-track">Supply Chain & Demand Planning</span>
        </div>
        <nav className="tab-nav">
          <button
            className={`tab-btn ${activeTab === "insight" ? "active" : ""}`}
            onClick={() => setActiveTab("insight")}
          >
            Insight Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === "action" ? "active" : ""}`}
            onClick={() => setActiveTab("action")}
          >
            Action Panel
          </button>
        </nav>
      </header>
      <main className="app-main">
        {activeTab === "insight" ? <InsightDashboard /> : <ActionApp />}
      </main>
    </div>
  );
}