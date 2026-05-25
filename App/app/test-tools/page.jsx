"use client";

import { useState } from "react";
import TestButton from "../components/TestButton";

export default function TestToolsPage() {
  const [loading, setLoading] = useState("");
  const [result, setResult] = useState("");

  async function runAction(type) {
    setLoading(type);
    setResult("");

    try {
      let res;

      if (type === "reset-quota") {
        res = await fetch("/api/webhook/reset-quota", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: `quota-reset-${Date.now()}`,
          }),
        });
      }

      if (type === "call-webhook") {
        res = await fetch("/api/test-tools/call-webhook", {
          method: "POST",
        });
      }

      if (type === "generate-leads") {
        res = await fetch("/api/test-tools/generate-leads", {
          method: "POST",
        });
      }

      const data = await res.json();

      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult("Something went wrong while running the test.");
    } finally {
      setLoading("");
    }
  }

  return (
    <main className="page">
      <div className="pageHeader">
        <h1>Test Tools</h1>
        <p>
          Use these tools to test quota reset, webhook idempotency, and
          concurrent lead generation.
        </p>
      </div>

      <div className="toolGrid">
        <TestButton
          title="Reset Provider Quota"
          description="Simulates successful payment webhook and resets provider quota to 10."
          loading={loading === "reset-quota"}
          onClick={() => runAction("reset-quota")}
        />

        <TestButton
          title="Call Same Webhook Again"
          description="Tests idempotency using same webhook event ID."
          loading={loading === "call-webhook"}
          onClick={() => runAction("call-webhook")}
        />

        <TestButton
          title="Generate 10 Leads"
          description="Creates 10 leads quickly to test concurrency and fair allocation."
          loading={loading === "generate-leads"}
          onClick={() => runAction("generate-leads")}
        />
      </div>

      {result && (
        <pre className="resultBox">
          {result}
        </pre>
      )}
    </main>
  );
}