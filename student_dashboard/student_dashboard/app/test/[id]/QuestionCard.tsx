interface Question {
  _id: string;
  description: string;
  mathFormula?: string;
  answerType: "mcq" | "written";
  marks: number;
  answer: {
    correct: string | null;
    options?: string[];
  };
}

interface Props {
  question: Question;
  index: number;
  answer: string;
  onAnswer: (id: string, value: string) => void;
}

export default function QuestionCard({
  question,
  index,
  answer,
  onAnswer,
}: Props) {
  return (
    <div className="border p-4 rounded bg-white shadow">
      {/* Question Title */}
      <h3 className="font-bold text-lg">
        {index + 1}. {question.description}
      </h3>

      {/* If formula exists, show as plain text */}
      {question.mathFormula && (
        <p className="text-gray-600 mt-1">Formula: {question.mathFormula}</p>
      )}

      {/* =============================
           CONDITIONAL RENDERING 
         =============================== */}

      {/* If type === mcq → Show only MCQ options */}
      {question.answerType === "mcq" && (
        <div className="mt-3 space-y-2">
          {question.answer.options?.map((opt) => (
            <label key={opt} className="flex items-center space-x-2">
              <input
                type="radio"
                name={question._id}
                value={opt}
                checked={answer === opt}
                onChange={() => onAnswer(question._id, opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}

      {/* If type === written → Show only Textarea */}
      {question.answerType === "written" && (
        <textarea
          rows={4}
          className="mt-3 w-full border p-2 rounded"
          value={answer}
          onChange={(e) => onAnswer(question._id, e.target.value)}
          placeholder="Write your answer..."
        />
      )}
    </div>
  );
}
