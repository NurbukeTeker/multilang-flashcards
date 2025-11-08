import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDomains, fetchTerms } from "./utils/cache";

export default function Flashcards() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [terms, setTerms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTerms() {
      try {
        setLoading(true);
        setError(null);

        const domains = await fetchDomains();
        const domain = domains.find((d) => d.slug === slug);

        if (!domain) throw new Error(`Domain "${slug}" not found`);

        const terms = await fetchTerms(domain.id);
        setTerms(terms);
      } catch (err) {
        console.error("Error loading terms:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTerms();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem", fontFamily: "sans-serif" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              width: "300px",
              height: "200px",
              margin: "0 auto",
              backgroundColor: "#f0f0f0",
              borderRadius: "1rem",
              animation: "pulse 1.5s infinite",
              marginBottom: "1rem",
            }}
          >
            <style>{`
              @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
              }
            `}</style>
          </div>
          <p>Loading flashcards...</p>
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer",
          }}
        >
          ← Back to home
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "4rem",
          fontFamily: "sans-serif",
          color: "#e53935",
        }}
      >
        <h2>😕 Oops!</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          ← Back to home
        </button>
      </div>
    );
  }

  if (terms.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem", fontFamily: "sans-serif" }}>
        <h2>No flashcards found</h2>
        <p>This category doesn't have any terms yet.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          ← Back to home
        </button>
      </div>
    );
  }

  const current = terms[currentIndex];
  const total = terms.length;
  const answered = score.correct + score.wrong;
  const progress = Math.round((answered / total) * 100);

  const handleAnswer = (knewIt) => {
    if (!knewIt) setTerms((prev) => [...prev, prev[currentIndex]]);
    setScore((prev) => ({
      correct: prev.correct + (knewIt ? 1 : 0),
      wrong: prev.wrong + (!knewIt ? 1 : 0),
    }));
    setFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  // ✅ Modern, clean "Session Complete" layout
  if (currentIndex >= terms.length) {
    const accuracy = Math.round((score.correct / (score.correct + score.wrong)) * 100) || 0;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          background: "linear-gradient(135deg, #f9fafc 0%, #f2f4f7 100%)",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "1.5rem",
            padding: "3rem 4rem",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            ✅ <span>Session Complete!</span>
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "#333",
              marginBottom: "2rem",
            }}
          >
            Correct: <b>{score.correct}</b> / Wrong: <b>{score.wrong}</b> ({accuracy}%)
          </p>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.8rem 1.6rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Default flashcard view
  return (
    <div style={{ textAlign: "center", marginTop: "4rem", fontFamily: "sans-serif" }}>
      <h1>{slug.toUpperCase()}</h1>

      {/* Progress Bar */}
      <div
        style={{
          width: "300px",
          height: "10px",
          backgroundColor: "#eee",
          borderRadius: "5px",
          margin: "1rem auto",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#4caf50",
            transition: "width 0.3s ease",
          }}
        ></div>
      </div>
      <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
        Progress: {answered}/{total}
      </p>

      {/* Flashcard */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          margin: "2rem auto",
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
          {/* Front (German) */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              backgroundColor: "#fafafa",
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

          {/* Back (English) */}
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

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          onClick={() => handleAnswer(true)}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#4caf50",
            color: "white",
            cursor: "pointer",
          }}
        >
          ✓ I knew it
        </button>
        <button
          onClick={() => handleAnswer(false)}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#f44336",
            color: "white",
            cursor: "pointer",
          }}
        >
          ✗ Didn’t know
        </button>
      </div>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        ✅ {score.correct} | ❌ {score.wrong}
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "2rem",
          fontSize: "0.9rem",
          opacity: 0.7,
          border: "none",
          background: "none",
          cursor: "pointer",
        }}
      >
        Back to Home
      </button>
    </div>
  );
}
