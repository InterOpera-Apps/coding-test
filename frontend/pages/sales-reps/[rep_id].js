
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import ClientModal from "../../components/ClientModal";  // Import modal

export default function SalesRepDetail() {
  const router = useRouter();
  const { rep_id } = router.query;
  const [salesRep, setSalesRep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null); // For modal

  useEffect(() => {
    if (!rep_id) return;
    

    if (!/^\d+$/.test(rep_id)) {
      setError("Invalid Sales Representative ID.");
      setLoading(false);
      return;
    }

    async function fetchSalesRepDetail() {
      try {
        const response = await fetch(`http://localhost:8000/api/sales-reps/${rep_id}`);
        const data = await response.json();
        if (response.status !== 200) {
          setError(data.detail || "Error fetching sales representative.");
        } else {
          setSalesRep(data);
        }
      } catch (err) {
        setError("Failed to fetch sales representative details.");
      }
      setLoading(false);
    }

    fetchSalesRepDetail();
  }, [rep_id]);

  return (
    <section style={{ padding: "2rem" }}>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : salesRep ? (
        <div>
          <h2>{salesRep.name}</h2>
          <p><strong>Role:</strong> {salesRep.role}</p>
          <p><strong>Region:</strong> {salesRep.region}</p>
          <p><strong>Skills:</strong> {salesRep.skills?.join(", ") || "N/A"}</p>
          <h4>Clients:</h4>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {salesRep.clients.length > 0 ? (
              salesRep.clients.map((client, index) => (
                <li 
                  key={index} 
                  style={{ 
                    background: "#f8f8f8", 
                    padding: "0.5rem", 
                    borderRadius: "4px", 
                    marginBottom: "0.5rem", 
                    cursor: "pointer", 
                    transition: "background 0.2s ease-in-out"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#e0e0e0"}  // Lighter gray on hover
                  onMouseLeave={(e) => e.currentTarget.style.background = "#f8f8f8"}  // Reset color on leave
                  onClick={() => setSelectedClient(client.contact)}  // Open modal
                >
                  <strong>{client.name}</strong> - {client.industry}
                  <br />
                  {/* <span style={{ fontSize: "0.9rem", color: "gray" }}>Value: ${client.value} | Status: {client.status}</span> */}
                </li>
              ))
            ) : (
              <li>No clients</li>
            )}
          </ul>
        </div>
      ) : (
        <p>No sales representative found.</p>
      )}

      {/* Render modal when a client is selected */}
      {selectedClient && (
        <ClientModal 
          rep_id={rep_id} 
          contact={selectedClient} 
          onClose={() => setSelectedClient(null)}  // Close modal
        />
      )}
    </section>
  );
}
