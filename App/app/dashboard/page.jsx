"use client";

import { useEffect, useState } from "react";
import ProviderCard from "../components/ProviderCard";

export default function DashboardPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  async function fetchDashboard() {
    try {
      const res = await fetch("/api/dashboard", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setProviders(data.data);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(fetchDashboard, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="page">
      <div className="pageHeader dashboardHeader">
        <div>
          <h1>Provider Dashboard</h1>
          <p>
            Real database data with auto-refresh every 3 seconds.
            {lastUpdated && ` Last updated at ${lastUpdated}.`}
          </p>
        </div>

        <button className="secondaryAction" onClick={fetchDashboard}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card">Loading dashboard...</div>
      ) : (
        <div className="grid">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </main>
  );
}