import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function App() {
  const [domains, setDomains] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/domains`)
      .then((res) => res.json())
      .then((data) => setDomains(data))
      .catch((err) => console.error("Error fetching domains:", err));
  }, []);

  const colors = ["#FFE4E1", "#E6E6FA", "#FFFACD", "#E0FFFF", "#F0FFF0", "#FFF0F5"];

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "3rem" }}>
      <h1>🌍 Multilang Flashcards</h1>
      <p>Choose a category:</p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {domains.map((domain, i) => (
          <div
            key={domain.id}
            onClick={() => navigate(`/domain/${domain.slug}`)}
            style={{
              cursor: "pointer",
              padding: "2rem 3rem",
              borderRadius: "1rem",
              backgroundColor: colors[i % colors.length],
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              minWidth: "180px",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h2 style={{ margin: 0 }}>{domain.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
