import React, { useState, useEffect } from "react";
import Header from "../Header/header";
import "./student.css";

function Student() {
  const [activeTab, setActiveTab] = useState("create");
  const [questions, setQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [savedResults, setSavedResults] = useState([]);

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_KEY;

  // ✅ Load saved results from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("quizResults")) || [];
    setSavedResults(stored);
  }, []);

  // ✅ Function to generate MCQs using Gemini API
  const handleGenerate = async () => {
    if (!GEMINI_API_KEY) {
      alert("❌ Gemini API key missing! Please check your .env file.");
      return;
    }

    if (!topic.trim()) {
      alert("Please enter a topic first!");
      return;
    }

    setLoading(true);
    setMcqs([]);
    setAnswers({});
    setResult(null);
    setShowResults(false);

    try {
      const prompt = `
      Generate ${questions} multiple choice questions on the topic "${topic}" 
      with ${difficulty} difficulty.
      Each question must have exactly 4 options and one correct answer.
      Return the output strictly in JSON format as an array like this:
      [
        {
          "question": "What is ...?",
          "options": ["A", "B", "C", "D"],
          "correct": "A"
        }
      ]
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsedMcqs = JSON.parse(cleanedText);

      if (Array.isArray(parsedMcqs)) {
        setMcqs(parsedMcqs);
      } else {
        alert("⚠️ Unexpected response format. Check console logs.");
      }
    } catch (error) {
      console.error("❌ Error generating MCQs:", error);
      alert("Error generating MCQs. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle option select
  const handleSelectOption = (qIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  };

  // ✅ Handle quiz submission and result storage
  const handleSubmit = () => {
    let correctCount = 0;
    mcqs.forEach((mcq, index) => {
      if (answers[index] === mcq.correct) correctCount++;
    });

    const score = `${correctCount}/${mcqs.length}`;
    setResult(score);
    setShowResults(true);

    // ✅ Save result to localStorage
    const newResult = {
      topic,
      score,
      date: new Date().toLocaleString(),
    };

    const updatedResults = [newResult, ...savedResults];
    setSavedResults(updatedResults);
    localStorage.setItem("quizResults", JSON.stringify(updatedResults));
  };

  return (
    <div>
      <Header />
      <div className="quiz-container">
        {/* Sidebar */}
        <aside className="quiz-sidebar">
          <div className="greet-card">
            <h4>👋 Welcome! Student 🎉</h4>
          </div>

          <div className="profile">
            <p>👤 Logged in as: Student</p>
          </div>

          <h3>Settings</h3>

          <label>Number of questions: {questions}</label>
          <input
            type="range"
            min="5"
            max="25"
            value={questions}
            onChange={(e) => setQuestions(Number(e.target.value))}
          />

          <label>Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </aside>

        {/* Main Content */}
        <main className="quiz-main">
          <div className="tabs">
            <button
              className={activeTab === "create" ? "active" : ""}
              onClick={() => setActiveTab("create")}
            >
              Self Practice (AI)
            </button>
            <button
              className={activeTab === "manage" ? "active" : ""}
              onClick={() => setActiveTab("manage")}
            >
              View Results
            </button>
            <button
              className={activeTab === "Teacher Quizes" ? "active" : ""}
              onClick={() => setActiveTab("Teacher Quizes")}
            >
              Teacher Quizzes
            </button>
          </div>

          {/* Create Quiz Section */}
          {activeTab === "create" && (
            <div className="create-quiz">
              <h2>Self Practice Quiz (AI)</h2>
              <textarea
                rows="6"
                placeholder="Enter Topic (e.g., Python Basics, Java OOPs, HTML tags...)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? "Generating..." : "+ Generate MCQs"}
              </button>

              {mcqs.length > 0 && (
                <div className="preview-section">
                  <h3>Quiz Paper</h3>
                  {mcqs.map((mcq, index) => {
                    const selected = answers[index];
                    const correct = mcq.correct;
                    const isCorrect = selected === correct;
                    return (
                      <div key={index} className="mcq-card">
                        <h4>
                          Q{index + 1}. {mcq.question}
                        </h4>
                        <div className="options">
                          {mcq.options.map((opt, i) => {
                            let optionClass = "";
                            if (showResults) {
                              if (opt === correct) optionClass = "correct-option";
                              else if (opt === selected && opt !== correct)
                                optionClass = "wrong-option";
                            }
                            return (
                              <label key={i} className={`option-label ${optionClass}`}>
                                <input
                                  type="radio"
                                  name={`q${index}`}
                                  value={opt}
                                  checked={answers[index] === opt}
                                  onChange={() => handleSelectOption(index, opt)}
                                  disabled={showResults}
                                />
                                {opt}
                              </label>
                            );
                          })}
                        </div>
                        {showResults && !isCorrect && (
                          <p className="correct-answer-text">
                            ✅ Correct Answer: <b>{mcq.correct}</b>
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {!showResults && (
                    <button className="submit-btn" onClick={handleSubmit}>
                      Submit
                    </button>
                  )}

                  {result && (
                    <div className="result-box">
                      <h3>🎯 Your Score: {result}</h3>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* View Results Section */}
          {activeTab === "manage" && (
            <div className="results-section">
              <h2>📊 Quiz Results History</h2>
              {savedResults.length === 0 ? (
                <p>No results yet. Take a quiz to see your progress!</p>
              ) : (
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Quiz Topic</th>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedResults.map((res, index) => (
                      <tr key={index}>
                        <td>{res.topic}</td>
                        <td>{res.score}</td>
                        <td>{res.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Student;
