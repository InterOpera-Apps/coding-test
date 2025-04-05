// pages/404.js
import Link from "next/link";

export default function Custom404() {
  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1 style={{ fontSize: "4rem", color: "#dc3545" }}>404</h1>
      <p style={{ fontSize: "1.5rem" }}>Oops! Page not found.</p>
      <Link href="/">
        <button style={{ marginTop: "1rem", padding: "0.6rem 1.2rem", background: "#007bff", color: "white", borderRadius: "5px", border: "none" }}>
          Go to Home
        </button>
      </Link>
    </div>
  );
}
