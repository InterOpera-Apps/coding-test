import Spinner from "react-bootstrap/Spinner";
import { useState } from "react";
import React from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const formatText = (input) => {
    return input
      .split('*')
      .map((part, index) => {
        if (index > 0) {
          const boldParts = part.split('**');
          return (
            <>
              {boldParts.map((boldPart, boldIndex) => (
                <React.Fragment key={boldIndex}>
                  {boldIndex % 2 === 1 ? <strong>{boldPart}</strong> : boldPart}
                  {boldIndex < boldParts.length - 1 && <br />}
                </React.Fragment>
              ))}
            </>
          );
        }
        return part;
      });
  };

  const handleAskQuestion = async () => {
    try {
        if (question != ""){
            setLoading(true);
            const response = await fetch("http://localhost:8000/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question }),
            });
            const data = await response.json();
            setAnswer(data.answer);
            setLoading(false);
        }
    } catch (error) {
        console.error("Error in AI request:", error);
        setLoading(false);
    }
  };

  return (
        <section>
          <h4>Ask a Question (AI Endpoint)</h4>
          <div>
            <input
              type="text"
              placeholder="Enter your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={handleAskQuestion} disabled={loading}>{loading ? <Spinner animation="border" size="sm" /> : "Ask"}
            </button>
          </div>
            {answer && (
                <div className="mt-5">
                <h5>AI Answer</h5>
                <p style={{ whiteSpace: "pre-wrap" }}>{formatText(answer)}</p>
                </div>
            )}
        </section>
  );
}
