import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="logo">
        LeadFlow
      </Link>

      <div className="navLinks">
        <Link href="/request-service">Request Service</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/test-tools">Test Tools</Link>
      </div>
    </nav>
  );
}