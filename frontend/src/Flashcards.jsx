import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function Flashcards() {
  const { slug } = useParams();
  const [terms, setTerms] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/domains`)
      .then((res) => res.json())
      .then((domains) => {
        const domain = domains.find((d) => d.slug === slug);
        if (domain) setTerms(domain.terms);
      });
  }, [slug]);

  if (terms.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <p>Kelime bulunamadı veya yükleniyor...</p>
        <button onClick={() => navigate("/")}>← Geri dön</button>
      </div>
    );
  }

  const current = terms[index];

  return (
    <div style={{ textAlign: "center", marginTop: "4rem", fontFamily: "sans-serif" }}>
      <h1>{slug.toUpperCase()}</h1>

      {/* Kart */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          margin: "3rem auto",
          width: "300px",
          height: "200px",
          perspective: "1000px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transition: "transform 0.6s",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "none",
          }}
        >
          {/* Front side (German) */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              backgroundColor: "#f9f9f9",
              borderRadius: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "2rem",
            }}
          >
            {current.de}
          </div>

          {/* Back side (English) */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              backgroundColor: "#f0f8ff",
              borderRadius: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "2rem",
            }}
          >
            {current.en}
          </div>
        </div>
      </div>

      {/* Kontroller */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          onClick={() => {
            setFlipped(false);
            setIndex((prev) => (prev - 1 + terms.length) % terms.length);
          }}
        >
          ← Önceki
        </button>

        <button
          onClick={() => {
            setFlipped(false);
            setIndex((prev) => (prev + 1) % terms.length);
          }}
        >
          Sonraki →
        </button>
      </div>

      <button
        onClick={() => navigate("/")}
        style={{ marginTop: "2rem", opacity: 0.7, fontSize: "0.9rem" }}
      >
        Ana sayfaya dön
      </button>
    </div>
  );
}
