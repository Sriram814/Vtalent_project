import React, { useState } from "react";
import Header from "../Header/header";
import "./admin.css";

function Admin() {
  const [activeTab, setActiveTab] = useState("create");
  const [questions, setQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Load Gemini API Key
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_KEY;


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

      // ✅ Use the correct model endpoint (gemini-2.5-flash)
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
      console.log("🔍 Gemini Response:", data);

      if (data.error) {
        alert(`Error generating MCQs. (Code: ${data.error.code})`);
        console.error(data.error);
        return;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsedMcqs = JSON.parse(cleanedText);

      if (Array.isArray(parsedMcqs)) {
        setMcqs(parsedMcqs);
      } else {
        alert("⚠️ Unexpected response format. Check console logs.");
        console.log("Response text:", cleanedText);
      }
    } catch (error) {
      console.error("❌ Error generating MCQs:", error);
      alert("Error generating MCQs. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle answer selection
  const handleSelectOption = (qIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  };

  return (
    <div>
      <Header />
      <div className="quiz-container">
        {/* Sidebar */}
        <aside className="quiz-sidebar">
          <div className="greet-card">
            <h4>👋 Hello, Have A Nice Day Admin! 🎉</h4>
          </div>

          <div className="profile">
            <p>👤 Logged in as: Teacher</p>
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
              Create Quiz (AI)
            </button>
            <button
              className={activeTab === "manage" ? "active" : ""}
              onClick={() => setActiveTab("manage")}
            >
              Manage Quizzes
            </button>
            <button
              className={activeTab === "results" ? "active" : ""}
              onClick={() => setActiveTab("results")}
            >
              View Results
            </button>
          </div>

          {activeTab === "create" && (
            <div className="create-quiz">
              <h2>Create Quiz (AI)</h2>
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
                  <h3>Preview MCQs</h3>
                  {mcqs.map((mcq, index) => (
                    <div key={index} className="mcq-card">
                      <h4>
                        Q{index + 1}. {mcq.question}
                      </h4>
                      <div className="options">
                        {mcq.options.map((opt, i) => (
                          <label key={i} className="option-label">
                            <input
                              type="radio"
                              name={`q${index}`}
                              value={opt}
                              checked={answers[index] === opt}
                              onChange={() => handleSelectOption(index, opt)}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                      <button
                        className="show-answer-btn"
                        onClick={() => alert(`✅ Correct Answer: ${mcq.correct}`)}
                      >
                        Show Answer
                      </button>
                    </div>
                  ))}

                  <div className="selected-answers">
                    <h4>Selected Answers (Preview):</h4>
                    <ul>
                      {Object.keys(answers).map((qIndex) => (
                        <li key={qIndex}>
                          Q{Number(qIndex) + 1}: {answers[qIndex]}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="publish-btn">Publish</button>
                </div>
              )}
            </div>
          )}

          {activeTab === "manage" && (
            <div>
              <h2>Manage Quizzes</h2>
              <p>Here you can edit or delete your quizzes.</p>
            </div>
          )}

          {activeTab === "results" && (
            <div>
              <h2>View Results</h2>
              <p>Here you can check quiz performance and reports.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Admin;
