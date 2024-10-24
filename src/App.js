import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [quiz, setQuiz] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCorrect, setIsCorrect] = useState({});
  const [allAnswered, setAllAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get("http://localhost:8080/quiz/get");
        setQuiz(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchQuiz();
  }, []);

  const handleAnswer = (questionId, option, correctAnswer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));

    setIsCorrect((prev) => ({
      ...prev,
      [questionId]: option === correctAnswer,
    }));

    if (Object.keys(selectedAnswers).length + 1 === quiz.length) {
      setAllAnswered(true);
    }
  };

  const handleSubmit = async () => {
    let calculatedScore = 0;
    quiz.forEach((q) => {
      if (isCorrect[q.id]) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);

    try {
      await axios.post("http://localhost:8080/quizScore/score", {
        score: calculatedScore,
      });
      alert("Score submitted successfully!");
    } catch (error) {
      console.error("Error submitting score: ", error);
    }
  };

  return (
    <div className="section">
      <div className="Container">
        <h1>Quiz on HTML!!</h1>
        {!submitted ? (
          quiz.map((q) => (
            <div className="card" key={q.id}>
              <p>{`${q.id}.${q.quiz_question}`}</p>
              <div>
                {[q.option_1, q.option_2, q.option_3, q.option_4].map(
                  (option, index) => (
                    <button
                      key={index}
                      className="quiz-option"
                      style={{
                        backgroundColor:
                          selectedAnswers[q.id] === option
                            ? isCorrect[q.id] &&
                              selectedAnswers[q.id] === option
                              ? "green"
                              : "red"
                            : "white",
                      }}
                      onClick={() => handleAnswer(q.id, option, q.is_correct)}
                      disabled={selectedAnswers[q.id]}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>
          ))
        ) : (
          <p>
            Your Score: {score}/{quiz.length}{" "}
            {score >= 4 ? "Excellent!" : "Good!  Try to improve..."}
          </p>
        )}

        {!submitted && (
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
