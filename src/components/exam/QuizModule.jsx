import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import QuestionCard from "./QuestionCard";

export default function QuizModule({ questions, moduleTitle, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const handleAnswer = (isCorrect) => {
    const newCorrect = correctCount + (isCorrect ? 1 : 0);
    if (isCorrect) setCorrectCount(newCorrect);

    if (currentQ + 1 >= questions.length) {
      onComplete({ module: moduleTitle, correct: newCorrect, total: questions.length });
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        <QuestionCard
          key={questions[currentQ].id}
          question={questions[currentQ]}
          questionNumber={currentQ + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          moduleTitle={moduleTitle}
        />
      </AnimatePresence>
    </div>
  );
}