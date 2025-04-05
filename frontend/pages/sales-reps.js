import { useEffect, useState } from "react";
import Header from "../components/Header";
import SalesRepCard from "../components/SalesRepCard";

export default function SalesReps() {
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  useEffect(() => {
    async function fetchSalesReps() {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/sales-reps?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        setSalesReps(data.sales_reps);
        setTotal(data.total);
      } catch (err) {
        console.error("Error fetching sales reps:", err);
        setError("Failed to fetch sales representatives.");
      } finally {
        setLoading(false);
      }
    }

    fetchSalesReps();
  }, [page]); // Fetch data when `page` changes
  return (
    <section style={{ padding: "2rem" }}>
      <Header />
      {/* <h2>Sales Representatives</h2> */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          {salesReps.length === 0 ? (
            <p>No sales representatives found.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {salesReps.map((rep) => (
                <SalesRepCard key={rep.id} rep={rep} />
              ))}
            </div>
          )}
        </div>
      )}
      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((prev) => (prev * limit < total ? prev + 1 : prev))} disabled={page * limit >= total}>
          Next
        </button>
      </div>
    </section>
  );
}
