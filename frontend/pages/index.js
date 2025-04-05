// // components/SalesReps.js
// import { useState, useEffect } from "react";
// import Chat from "../components/Chat";
// import Header from "../components/Header";
// import SalesRepCard from "../components/SalesRepCard";

// export default function SalesReps() {
//   const [salesReps, setSalesReps] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");  // Add search query state
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const limit = 5;

//   useEffect(() => {
//     async function fetchSalesReps() {
//       setLoading(true);
//       try {
//         const response = await fetch(`http://localhost:8000/api/sales-reps?page=${page}&limit=${limit}`);
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
//         const data = await response.json();
//         setSalesReps(data.sales_reps);
//         setTotal(data.total);
//       } catch (err) {
//         console.error("Error fetching sales reps:", err);
//         setError("Failed to fetch sales representatives.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchSalesReps();
//   }, [page]); // Fetch data when `page` changes

//   // Filter sales reps based on the search query
//   const filteredSalesReps = salesReps.filter(rep => 
//     rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     rep.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     rep.region.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <section style={{ padding: "2rem" }}>
//       <Header /> {/* Include Header component */}

//       <div style={{ marginBottom: "1rem", textAlign: "center" }}>
//         <input 
//           type="text" 
//           placeholder="Search sales reps..." 
//           value={searchQuery} 
//           onChange={(e) => setSearchQuery(e.target.value)} 
//           style={{
//             padding: "0.5rem", 
//             width: "80%", 
//             maxWidth: "400px", 
//             borderRadius: "4px", 
//             border: "1px solid #ccc",
//           }} 
//         />
//       </div>

//       {/* <h2>Sales Representatives</h2> */}
      
//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p style={{ color: "red" }}>{error}</p>
//       ) : (
//         <div>
//           {filteredSalesReps.length === 0 ? (
//             <p>No sales representatives found.</p>
//           ) : (
//             <div style={{ display: "grid", gap: "1rem" }}>
//               {filteredSalesReps.map((rep) => (
//                 <SalesRepCard key={rep.id} rep={rep} />
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
//         <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
//           Previous
//         </button>
//         <span>Page {page}</span>
//         <button onClick={() => setPage((prev) => (prev * limit < total ? prev + 1 : prev))} disabled={page * limit >= total}>
//           Next
//         </button>
//       </div>
//     </section>
//   );
// }


import { useState, useEffect } from "react";
import Chat from "../components/Chat";
import Header from "../components/Header";
import SalesRepCard from "../components/SalesRepCard";

export default function SalesReps() {
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat popup state
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
  }, [page]);

  // Filter sales reps based on the search query
  const filteredSalesReps = salesReps.filter(rep => 
    rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rep.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rep.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section style={{ padding: "2rem" }}>
      <Header />

      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <input 
          type="text" 
          placeholder="Search sales reps..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={{
            padding: "0.5rem", 
            width: "80%", 
            maxWidth: "400px", 
            borderRadius: "4px", 
            border: "1px solid #ccc",
          }} 
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          {filteredSalesReps.length === 0 ? (
            <p>No sales representatives found.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {filteredSalesReps.map((rep) => (
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

      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#007bff",
          color: "white",
          padding: "10px 15px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          fontSize: "1.5rem",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
        }}
      >
        💬
      </button>

      {/* Chat Pop-up Window */}
      {isChatOpen && (
        <div 
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            padding: "10px",
            zIndex: 1000
          }}
        >
          <div 
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 10px",
              borderBottom: "1px solid #ddd"
            }}
          >
            <strong>Live Chat</strong>
            <button 
              onClick={() => setIsChatOpen(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer"
              }}
            >
              ✖
            </button>
          </div>
          <Chat />
        </div>
      )}
    </section>
  );
}
