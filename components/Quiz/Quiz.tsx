"use client"
import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    // Aquí puedes hacer una petición a una API para obtener preguntas
    // setQuestions(data);
  }, []);

  const handleAnswer = (answer: string): void => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = (): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishQuiz = (): void => {
    setShowResult(true);
  };

  return (
    <div className="text-white text-center p-8 bg-[#ad1e1e] rounded-xl">
      {questions.length === 0 ? (
        <>
          <p>No questions available. Please try again.</p>
          <button className="mt-4 px-6 py-2 bg-[#E44D26] rounded-lg text-white">
            Try Again
          </button>
        </>
      ) : (
        <>
          {!showResult ? (
            <>
              <h2 className="text-lg font-bold">{questions[currentQuestion].question}</h2>
              <div className="flex flex-col mt-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="mt-2 px-4 py-2 bg-blue-500 rounded-lg text-white"
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 bg-gray-500 rounded-lg text-white"
                >
                  Back
                </button>
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-green-500 rounded-lg text-white"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleFinishQuiz}
                    className="px-4 py-2 bg-red-500 rounded-lg text-white"
                  >
                    Finish
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-xl">Quiz finished! Thank you for playing.</p>
          )}
        </>
      )}
    </div>
  );
}
