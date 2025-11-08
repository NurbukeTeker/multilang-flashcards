import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function Flashcards() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [terms, setTerms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  useEffect(() => {
    // fetch domain terms
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
        <p>Loading terms...</p>
        <button onClick={() => navigate("/")}>← Back to home</button>
      </div>
    );
  }

  const current = terms[currentIndex];

  const total = terms.length;
  const answered = score.correct + score.wrong;
  const progress = Math.round((answered / total) * 100);

  const handleAnswer = (knewIt) => {
    // if user didn’t know, push the card again at the end
    if (!knewIt) {
      setTerms((prev) => [...prev, prev[currentIndex]]);
    }

    // update score
    setScore((prev) => ({
      correct: prev.correct + (knewIt ? 1 : 0),
      wrong: prev.wrong + (!knewIt ? 1 : 0),
    }));

    // move to next
    setFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  if (currentIndex >= terms.length) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <h1>✅ Session Complete!</h1>
        <p>
          Correct: {score.correct} / Wrong: {score.wrong} ({progress}%)
        </p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "4rem", fontFamily: "sans-serif" }}>
      <h1>{slug.toUpperCase()}</h1>

      {/* progress bar */}
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

      {/* Action buttons */}
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

      {/* Score summary */}
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
