import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ClientDealList({ deals, repId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (isOpen && repId) {
      fetch(`http://localhost:8000/api/deal-count/${repId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setChartData([
              {
                name: "Deals",
                "In Progress": data["In Progress"] || 0,
                "Closed Won": data["Closed Won"] || 0,
                "Closed Lost": data["Closed Lost"] || 0,
              },
            ]);
          }
        });
    }
  }, [isOpen, repId]);

  return (
    <div>
      <h4
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          userSelect: "none",
          background: "#007bff",
          color: "white",
          padding: "0.5rem",
          borderRadius: "4px",
          textAlign: "center",
        }}
      >
        Clients Deals {isOpen ? "▲" : "▼"}
      </h4>

      {isOpen && (
        <>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {deals.length > 0 ? (
              deals.map((deal, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#f8f8f8",
                    padding: "0.3rem",
                    borderRadius: "4px",
                    marginBottom: "0.2rem",
                    fontSize: "0.85rem",
                  }}
                >
                  <span><strong>{deal.client}</strong></span>
                  <span
                    style={{
                      color:
                      deal.status === "Closed Won"
                          ? "green"
                          : deal.status === "Closed Lost"
                          ? "red"
                          : "gray",
                    }}
                  >
                    ${deal.value} | {deal.status}
                  </span>
                </li>
              ))
            ) : (
              <li style={{ fontSize: "0.85rem" }}>No clients</li>
            )}
          </ul>

          {chartData && (
            <div style={{ height: 250, marginTop: "1rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="In Progress" fill="#ffc107" />
                  <Bar dataKey="Closed Won" fill="#28a745" />
                  <Bar dataKey="Closed Lost" fill="#dc3545" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
