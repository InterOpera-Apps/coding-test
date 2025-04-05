import { useEffect, useState } from "react";

export default function ClientModal({ rep_id, contact, onClose }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rep_id || !contact) return;

    async function fetchClientDetail() {
      try {
        const response = await fetch(`http://localhost:8000/api/clients/${rep_id}/${contact}`);
        const data = await response.json();
        if (data.detail) {
          setError("Client not found.");
        } else {
          setClient(data);
        }
      } catch (err) {
        setError("Failed to fetch client details.");
      }
      setLoading(false);
    }

    fetchClientDetail();
  }, [rep_id, contact]);

  // Close modal if user clicks outside of it
  const handleOverlayClick = (event) => {
    if (event.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div id="modal-overlay" style={modalStyles.overlay} onClick={handleOverlayClick}>
      <div style={modalStyles.modal}>
        {/* Close Button */}
        <button onClick={onClose} style={modalStyles.closeButton}>✖</button>

        <h2>Client Detail</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : client ? (
          <div>
            <h3>{client.name}</h3>
            <p><strong>Industry:</strong> {client.industry}</p>
            <p><strong>Contact:</strong> {client.contact}</p>
          </div>
        ) : (
          <p>Client not found.</p>
        )}
      </div>
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    width: "400px",
    position: "relative",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "15px",
    border: "none",
    background: "none",
    fontSize: "1.8rem",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#333",
  },
};
