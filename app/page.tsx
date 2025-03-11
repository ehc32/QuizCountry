import Quiz from "@/components/quiz";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1F2157] p-8">
      <div className="w-full max-w-3xl mx-auto pt-8">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white">Country Quiz</h1>
        </header>
        <Quiz />
      </div>
    </main>
  );
}
  