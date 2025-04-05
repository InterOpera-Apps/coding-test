import { useState, useEffect } from "react";

export default function ClientList({ clients, repId }) {
  const [isOpen, setIsOpen] = useState(false);


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
        Clients {isOpen ? "▲" : "▼"}
      </h4>

      {isOpen && (
        <>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {clients.length > 0 ? (
              clients.map((client, index) => (
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
                  <span><strong>{client.name}</strong></span>
                </li>
              ))
            ) : (
              <li style={{ fontSize: "0.85rem" }}>No clients</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
