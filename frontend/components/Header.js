import Link from "next/link";

export default function Header() {
  return (
    <header style={{ textAlign: "center", padding: "1rem", background: "#007bff", color: "white", borderRadius: "8px", marginBottom: "1rem" }}>
      <Link href="/" style={{ color: "white", textDecoration: "none" }}>
        <h1 style={{ margin: 0, cursor: "pointer" }}>Sales Representatives Dashboard</h1>
      </Link>
    </header>
  );
}
