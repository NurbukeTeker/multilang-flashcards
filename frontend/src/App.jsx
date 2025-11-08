import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDomains } from "./utils/cache";

// 🎨 individual color palette
const domainColors = {
  Colors: "#ffe5e5",
  Animals: "#e5e0ff",
  Fruits: "#fff9cc",
  Clothes: "#ccf3ff",
  "Body Parts": "#e6ffe6",
  Food: "#ffe6e6",
  Drinks: "#fbffc8ff",
  Furniture: "#e6e6ff",
  Nature: "#ffffcc",
  Weather: "#ccffff",
  Vehicles: "#e6ffe6",
  Professions: "#ffe6e6",
  Sports: "#d1f0f5ff",
  School: "#e5e0ff",
  Technology: "#fff9cc",
  Music: "#ccffff",
  Emotions: "#e6ffe6",
  Tools: "#ffe6e6",
  Places: "#e9ffdcff",
  Numbers: "#fcd4dbff",
};

// 💫 emoji mapping
const domainEmojis = {
  Colors: "🎨",
  Animals: "🐾",
  Fruits: "🍎",
  Clothes: "👕",
  "Body Parts": "🧠",
  Food: "🍽️",
  Drinks: "🥤",
  Furniture: "🪑",
  Nature: "🌿",
  Weather: "🌦️",
  Vehicles: "🚗",
  Professions: "💼",
  Sports: "🏅",
  School: "🎓",
  Technology: "💻",
  Music: "🎵",
  Emotions: "😊",
  Tools: "🛠️",
  Places: "🏙️",
  Numbers: "🔢",
};

export default function App() {
  const [domains, setDomains] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDomains() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDomains();
        setDomains(data);
      } catch (err) {
        console.error("Error fetching domains:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDomains();
  }, []);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
        marginTop: "3rem",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>🌍 Multilang Flashcards</h1>
      
      {error && (
        <div style={{ color: "#e53935", margin: "2rem 0" }}>
          <p>😕 Error loading categories: {error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer",
              marginTop: "1rem"
            }}
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ margin: "2rem 0" }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginTop: "2rem",
          }}>
            {/* Loading skeleton for categories */}
            {[1,2,3,4].map(n => (
              <div
                key={n}
                style={{
                  padding: "2rem 3rem",
                  borderRadius: "1rem",
                  backgroundColor: "#f0f0f0",
                  minWidth: "180px",
                  animation: "pulse 1.5s infinite",
                }}
              >
                <div style={{ height: "1.3rem", width: "100%" }} />
              </div>
            ))}
          </div>
          <style>{`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          `}</style>
        </div>
      ) : (
        <p style={{ opacity: 0.8 }}>Choose a category:</p>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {domains.map((domain) => (
          <div
            key={domain.id}
            onClick={() => navigate(`/flashcards/${domain.slug}`)}
            style={{
              cursor: "pointer",
              padding: "2rem 3rem",
              borderRadius: "1rem",
              backgroundColor: domainColors[domain.name] || "#f5f5f5",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              minWidth: "180px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.3rem" }}>
              {domainEmojis[domain.name]} {domain.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
