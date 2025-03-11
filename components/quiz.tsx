"use client"

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import Image from "next/image"
import { shuffleArray } from "@/lib/utils"
import QuestionNavigation from "./question-navigation"
import Congratulations from "./congratulations"

type Country = {
  name: {
    common: string
    official: string
  }
  flags: {
    png: string
    svg: string
    alt?: string
  }
  capital?: string[]
  region: string
  population: number
  currencies?: Record<string, { name: string; symbol: string }>
}

type Question = {
  type: "flag" | "capital" | "population" | "region"
  question: string
  correctAnswer: string
  options: string[]
  countryData?: Country
}

type Answer = {
  questionIndex: number
  selectedOption: string | null
  isCorrect: boolean
}

export default function Quiz() {
  const [countries, setCountries] = useState<Country[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://restcountries.com/v3.1/all")
        if (!response.ok) {
          throw new Error("Failed to fetch countries")
        }
        const data: Country[] = await response.json()
        setCountries(data)
        generateQuestions(data)
      } catch (err) {
        setError("Error fetching countries. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  const generateQuestions = (countriesData: Country[]) => {
    if (!countriesData.length) return

    const validCountries = countriesData.filter(
      (country) => country.name && country.flags && country.capital && country.capital.length > 0,
    )

    const selectedCountries = shuffleArray([...validCountries]).slice(0, 10)

    const newQuestions: Question[] = selectedCountries.map((country, index) => {
      const questionType =
        index % 4 === 0 ? "flag" : index % 4 === 1 ? "capital" : index % 4 === 2 ? "population" : "region"

      const otherCountries = shuffleArray(validCountries.filter((c) => c.name.common !== country.name.common)).slice(
        0,
        3,
      )

      let question = ""
      let correctAnswer = ""
      let options: string[] = []

      switch (questionType) {
        case "flag":
          question = `Which country does this flag belong to?`
          correctAnswer = country.name.common
          options = [country.name.common, ...otherCountries.map((c) => c.name.common)]
          break
        case "capital":
          question = `${country.capital?.[0]} is the capital of which country?`
          correctAnswer = country.name.common
          options = [country.name.common, ...otherCountries.map((c) => c.name.common)]
          break
        case "population":
          question = `Which country has a population of about ${(country.population / 1000000).toFixed(1)} million people?`
          correctAnswer = country.name.common
          options = [country.name.common, ...otherCountries.map((c) => c.name.common)]
          break
        case "region":
          question = `Which of these countries is located in ${country.region}?`
          correctAnswer = country.name.common
          options = [
            country.name.common,
            ...otherCountries
              .filter((c) => c.region !== country.region)
              .slice(0, 3)
              .map((c) => c.name.common),
          ]
          break
      }

      return {
        type: questionType,
        question,
        correctAnswer,
        options: shuffleArray(options),
        countryData: country,
      }
    })

    setQuestions(newQuestions)
    setAnswers(
      newQuestions.map((_, index) => ({
        questionIndex: index,
        selectedOption: null,
        isCorrect: false,
      })),
    )
  }

  const handleAnswerSelect = (option: string) => {
    if (answers[currentQuestionIndex].selectedOption !== null) {
      return
    }

    const isCorrect = option === questions[currentQuestionIndex].correctAnswer

    const updatedAnswers = [...answers]
    updatedAnswers[currentQuestionIndex] = {
      ...updatedAnswers[currentQuestionIndex],
      selectedOption: option,
      isCorrect,
    }
    setAnswers(updatedAnswers)

    const allAnswered = updatedAnswers.every((answer) => answer.selectedOption !== null)
    if (allAnswered) {
      setTimeout(() => {
        setQuizCompleted(true)
      }, 1000)
    }
  }

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const restartQuiz = () => {
    generateQuestions(countries)
    setCurrentQuestionIndex(0)
    setQuizCompleted(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E95DB3]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-white text-center p-8 bg-[#272A5B] rounded-xl">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-[#E95DB3] rounded-lg text-white">
          Try Again
        </button>
      </div>
    )
  }

  if (quizCompleted) {
    const correctAnswersCount = answers.filter((answer) => answer.isCorrect).length
    return (
      <Congratulations correctCount={correctAnswersCount} totalQuestions={questions.length} onRestart={restartQuiz} />
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-white text-center p-8 bg-[#272A5B] rounded-xl">
        <p>No questions available. Please try again.</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-[#E95DB3] rounded-lg text-white">
          Try Again
        </button>
      </div>
    )
  }

  const correctAnswersCount = answers.filter((answer) => answer.isCorrect).length

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestionIndex]

  return (
    <div className="bg-[#272A5B] rounded-[32px] p-12 max-w-3xl mx-auto shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <QuestionNavigation
          totalQuestions={questions.length}
          currentIndex={currentQuestionIndex}
          answers={answers}
          onNavigate={navigateToQuestion}
        />
        <div className="bg-[#E95DB3] rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-yellow-300">🏆</span>
          <span className="text-white font-medium">
            {correctAnswersCount}/{questions.length} Points
          </span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-white text-2xl mb-8">
          {currentQuestion.type === "flag" && currentQuestion.countryData ? (
            <div className="flex flex-col items-center gap-4">
              <Image
                src={currentQuestion.countryData.flags.svg || "/placeholder.svg"}
                alt={currentQuestion.countryData.flags.alt || `Flag of ${currentQuestion.countryData.name.common}`}
                width={120}
                height={80}
                className="rounded-md object-cover"
              />
              <span>{currentQuestion.question}</span>
            </div>
          ) : (
            currentQuestion.question
          )}
        </h2>

        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
          {currentQuestion.options.map((option, index) => {
            const isSelected = currentAnswer.selectedOption === option
            const isCorrect = option === currentQuestion.correctAnswer

            let buttonClass = "w-full py-4 px-6 rounded-xl text-white font-medium text-left transition-all"

            if (currentAnswer.selectedOption === null) {
              buttonClass += " bg-[#2B2F66] hover:bg-[#323875]"
            } else if (isSelected) {
              buttonClass += isCorrect ? " bg-green-500/50" : " bg-[#E95DB3]"
            } else if (isCorrect) {
              buttonClass += " bg-green-500/50"
            } else {
              buttonClass += " bg-[#2B2F66] opacity-70"
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswerSelect(option)}
                disabled={currentAnswer.selectedOption !== null}
              >
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  {currentAnswer.selectedOption !== null && isCorrect && <Check className="text-white" size={20} />}
                  {currentAnswer.selectedOption !== null && isSelected && !isCorrect && (
                    <X className="text-white" size={20} />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

