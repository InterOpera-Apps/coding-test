import Link from "next/link";
import ClientDealList from "./ClientDealList";


export default function SalesRepCard({ rep }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h3>{rep.name}</h3>
      <p><strong>Role:</strong> {rep.role}</p>
      <p><strong>Region:</strong> {rep.region}</p>
      <p><strong>Skills:</strong> {rep.skills?.join(", ") || "N/A"}</p>

      <ClientDealList deals={rep.deals} repId={rep.id} />

      <Link href={`/sales-reps/${rep.id}`}>
        <button style={{ marginTop: "1rem", padding: "0.5rem", background: "#007bff", color: "white", borderRadius: "4px" }}>
          View Details
        </button>
      </Link>
    </div>
  );
}
