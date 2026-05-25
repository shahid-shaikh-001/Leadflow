"use client";

export default function TestButton({ title, description, onClick, loading }) {
  return (
    <button className="toolButton" onClick={onClick} disabled={loading}>
      <strong>{loading ? "Running..." : title}</strong>
      <span>{description}</span>
    </button>
  );
}