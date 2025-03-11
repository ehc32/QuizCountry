"use client"

import { PartyPopper } from "lucide-react"
import ReactConfetti from "react-confetti"
import { useWindowSize } from "react-use"

interface CongratulationsProps {
  correctCount: number
  totalQuestions: number
  onRestart: () => void
}

export default function Congratulations({ correctCount, totalQuestions, onRestart }: CongratulationsProps) {
  const { width, height } = useWindowSize();

  return (
    <div className="bg-[#393F6E] rounded-3xl p-8 max-w-sm mx-auto text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-yellow-100 p-4 rounded-full">
          <PartyPopper className="text-yellow-500" size={32} />
        </div>
      </div>

      <h2 className="text-white text-2xl font-bold mb-2">Congrats! You completed the quiz.</h2>

      <p className="text-gray-300 mb-8">
        You answered {correctCount}/{totalQuestions} correctly
      </p>
      <ReactConfetti
  drawShape={ctx => {
    ctx.beginPath()
    for(let i = 0; i < 22; i++) {
      const angle = 0.35 * i
      const x = (0.2 + (1.5 * angle)) * Math.cos(angle)
      const y = (0.2 + (1.5 * angle)) * Math.sin(angle)
      ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.closePath()
  }}
/>
      <button
        onClick={onRestart}
        className="w-full py-3 px-6 bg-[#linear-gradient(#E65895, #BC6BE8)] hover:bg-[#linear-gradient(#E65895, #BC6BE8)]/90 rounded-xl text-white font-medium transition-all"
      >
        Play again
      </button>
    </div>
  )
}

