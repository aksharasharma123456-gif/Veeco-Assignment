import { createContext, useContext, useState } from "react";
import initialData from "../data/mockData.json";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [products] = useState(initialData.products);
  const [suppliers] = useState(initialData.suppliers);
  const [inventory] = useState(initialData.inventory);
  const [forecasts, setForecasts] = useState(initialData.demand_forecasts);
  const [supplyUpdates, setSupplyUpdates] = useState(initialData.supply_updates);

  function updateForecast(product_id, month, newQty) {
    setForecasts((prev) =>
      prev.map((f) =>
        f.product_id === product_id && f.month === month
          ? { ...f, forecast_qty: Number(newQty) }
          : f
      )
    );
  }

  function addSupplyUpdate(update) {
    setSupplyUpdates((prev) => [
      { ...update, id: Date.now(), ts: new Date().toISOString() },
      ...prev,
    ]);
  }

  return (
    <AppContext.Provider
      value={{ products, suppliers, inventory, forecasts, supplyUpdates, updateForecast, addSupplyUpdate }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}