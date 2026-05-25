import Link from "next/link";

export default function Home() {
  return (
    <main className="hero">
      <section className="heroCard">
        <span className="badge">Mini Lead Distribution System</span>

        <h1>Distribute Leads Fairly, Safely, and Automatically</h1>

        <p>
          LeadFlow captures customer enquiries, assigns mandatory providers,
          respects monthly quotas, and rotates remaining providers using a
          concurrency-safe round-robin allocation system.
        </p>

        <div className="heroButtons">
          <Link href="/request-service" className="primaryBtn">
            Submit Service Request
          </Link>

          <Link href="/dashboard" className="secondaryBtn">
            View Provider Dashboard
          </Link>
        </div>

        <div className="featureGrid">
          <div>
            <h3>Fair Allocation</h3>
            <p>Persistent round-robin distribution prevents repeated favoritism.</p>
          </div>

          <div>
            <h3>Quota Protection</h3>
            <p>Providers cannot exceed their monthly lead receiving limit.</p>
          </div>

          <div>
            <h3>Live Dashboard</h3>
            <p>Provider data refreshes automatically without manual reloads.</p>
          </div>
        </div>
      </section>
    </main>
  );
}