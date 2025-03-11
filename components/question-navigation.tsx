"use client"

type Answer = {
  questionIndex: number
  selectedOption: string | null
  isCorrect: boolean
}

interface QuestionNavigationProps {
  totalQuestions: number
  currentIndex: number
  answers: Answer[]
  onNavigate: (index: number) => void
}

export default function QuestionNavigation({
  totalQuestions,
  currentIndex,
  answers,
  onNavigate,
}: QuestionNavigationProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: totalQuestions }).map((_, index) => {
        const answer = answers[index]
        const isAnswered = answer?.selectedOption !== null
        const isActive = currentIndex === index

        let buttonClass =
          "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium transition-all"

        if (isActive || (isAnswered && answer.isCorrect)) {
          buttonClass += " bg-[#E95DB3]"
        } else {
          buttonClass += " bg-[#2B2F66]"
        }

        return (
          <button key={index} className={buttonClass} onClick={() => onNavigate(index)}>
            {index + 1}
          </button>
        )
      })}
    </div>
  )
}

