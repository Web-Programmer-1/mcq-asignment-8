

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Timer from "./Timer";
import QuestionCard from "./QuestionCard";
import Swal from "sweetalert2";

// ==== TYPES ====
interface Question {
  _id: string;
  description: string;
  answerType: "mcq" | "written";
  marks: number;
  answer: {
    correct: string | null;
    options?: string[];
  };
}

interface Exam {
  _id: string;
  duration_minutes: number;
  questions: Question[];
}



const exam: Exam = {
  _id: "exam_bd_001",
  duration_minutes: 45,
  questions: [
    // ============================
    //         15 MCQ QUESTIONS
    // ============================

    {
      _id: "mcq1",
      description: "বাংলাদেশ স্বাধীনতা লাভ করে কবে?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "১৯৭১",
        options: ["১৯৪৭", "১৯৫২", "১৯৭১", "১৯৭৫"]
      }
    },

    {
      _id: "mcq2",
      description: "বাংলাদেশের জাতীয় সঙ্গীত কে রচনা করেছেন?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "রবীন্দ্রনাথ ঠাকুর",
        options: ["কাজী নজরুল ইসলাম", "রবীন্দ্রনাথ ঠাকুর", "জসীম উদ্দীন", "আলাউদ্দীন আলী"]
      }
    },

    {
      _id: "mcq3",
      description: "বাংলাদেশের রাজধানী কোনটি?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "ঢাকা",
        options: ["চট্টগ্রাম", "ঢাকা", "সিলেট", "রাজশাহী"]
      }
    },

    {
      _id: "mcq4",
      description: "বাংলাদেশের জাতীয় ফুল কোনটি?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "শাপলা",
        options: ["রজনীগন্ধা", "শাপলা", "গোলাপ", "বকুল"]
      }
    },

    {
      _id: "mcq5",
      description: "বাংলাদেশের মুদ্রার নাম কী?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "টাকা",
        options: ["রুপি", "টাকা", "দিনার", "ডলার"]
      }
    },

    {
      _id: "mcq6",
      description: "বাংলা ভাষা আন্দোলন কোন বছরে সংঘটিত হয়?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "১৯৫২",
        options: ["১৯৪৮", "১৯৫২", "১৯৬০", "১৯৭১"]
      }
    },

    {
      _id: "mcq7",
      description: "বাংলাদেশের জাতীয় কবি কে?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "কাজী নজরুল ইসলাম",
        options: ["সুকান্ত ভট্টাচার্য", "জসীম উদ্দীন", "কাজী নজরুল ইসলাম", "বাঙালি কবি"]
      }
    },

    {
      _id: "mcq8",
      description: "বাংলাদেশের সবচেয়ে বড় নদী কোনটি?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "পদ্মা",
        options: ["মেঘনা", "যমুনা", "পদ্মা", "গোমতি"]
      }
    },

    {
      _id: "mcq9",
      description: "বাংলাদেশের প্রথম রাষ্ট্রপতি কে ছিলেন?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "বঙ্গবন্ধু শেখ মুজিবুর রহমান",
        options: ["জিয়াউর রহমান", "ইয়াহিয়া খান", "বঙ্গবন্ধু শেখ মুজিবুর রহমান", "মোস্তাক আহমেদ"]
      }
    },

    {
      _id: "mcq10",
      description: "একুশে ফেব্রুয়ারি কোন দিবস হিসেবে পালন করা হয়?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "আন্তর্জাতিক মাতৃভাষা দিবস",
        options: ["শহীদ দিবস", "বিজয় দিবস", "স্বাধীনতা দিবস", "আন্তর্জাতিক মাতৃভাষা দিবস"]
      }
    },

    {
      _id: "mcq11",
      description: "বাংলাদেশের জাতীয় ফল কোনটি?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "কাঁঠাল",
        options: ["আম", "কাঁঠাল", "লিচু", "কলা"]
      }
    },

    {
      _id: "mcq12",
      description: "বঙ্গবন্ধু সেতু কোন নদীর উপর নির্মিত?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "যমুনা",
        options: ["পদ্মা", "যমুনা", "মেঘনা", "ধলেশ্বরী"]
      }
    },

    {
      _id: "mcq13",
      description: "বাংলাদেশের সবচেয়ে বড় জেলা কোনটি?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "রংপুর",
        options: ["ঢাকা", "কুমিল্লা", "রংপুর", "বান্দরবান"]
      }
    },

    {
      _id: "mcq14",
      description: "বাংলাদেশের প্রধান ধর্ম কোনটি?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "ইসলাম",
        options: ["বৌদ্ধ", "হিন্দু", "খ্রিস্টান", "ইসলাম"]
      }
    },

    {
      _id: "mcq15",
      description: "বাংলাদেশের সবচেয়ে বড় সমুদ্রবন্দর কোনটি?",
      answerType: "mcq",
      marks: 5,
      answer: {
        correct: "চট্টগ্রাম বন্দর",
        options: ["মংলা", "চট্টগ্রাম বন্দর", "পায়রা", "টেকনাফ"]
      }
    },

    // ============================
    //      15 WRITTEN QUESTIONS
    // ============================

    {
      _id: "w1",
      description: "বাংলাদেশের স্বাধীনতার ইতিহাস সংক্ষেপে লিখুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w2",
      description: "একুশে ফেব্রুয়ারির গুরুত্ব ব্যাখ্যা করুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w3",
      description: "বঙ্গবন্ধু শেখ মুজিবুর রহমানের জীবনী সংক্ষেপে লিখুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w4",
      description: "বাংলাদেশের প্রধান নদীগুলোর গুরুত্ব লিখুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w5",
      description: "বাংলাদেশের কৃষির উন্নয়নে সরকারের ভূমিকা ব্যাখ্যা করুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w6",
      description: "মুক্তিযুদ্ধের প্রধান ঘটনাবলী উল্লেখ করুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w7",
      description: "ভাষা আন্দোলনের তাৎপর্য কী?",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w8",
      description: "বাংলাদেশের প্রাকৃতিক সৌন্দর্যের উপর একটি অনুচ্ছেদ লিখুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w9",
      description: "বাংলাদেশের প্রধান শিল্পসমূহ বর্ণনা করুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w10",
      description: "বাংলাদেশের অর্থনীতিতে পোশাক শিল্পের অবদান লিখুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w11",
      description: "বাংলাদেশের শিক্ষা ব্যবস্থার চ্যালেঞ্জসমূহ ব্যাখ্যা করুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w12",
      description: "বাংলাদেশের জলবায়ু পরিবর্তনজনিত সমস্যাসমূহ লিখুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w13",
      description: "সাহিত্য ও সংস্কৃতিতে বাংলাদেশের অবদান ব্যাখ্যা করুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w14",
      description: "গ্রামীণ উন্নয়নে নারীর ভূমিকা লিখুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    },

    {
      _id: "w15",
      description: "ডিজিটাল বাংলাদেশের অগ্রযাত্রা সম্পর্কে একটি রচনা লিখুন।",
      answerType: "written",
      marks: 10,
      answer: { correct: null }
    }
  ]
};


export default function ExamPage() {
  const { id } = useParams();
  const examId = id as string;

  const [examType, setExamType] = useState<"mcq" | "written">("mcq");

  const filteredQuestions = exam.questions.filter(
    (q) => q.answerType === examType
  );

  const totalQuestions = filteredQuestions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeUp, setTimeUp] = useState(false);
  const [result, setResult] = useState<any>(null);

  const currentQuestion = filteredQuestions[currentIndex];

  const handleAnswer = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const progressPercent = Math.round(
    ((currentIndex + 1) / totalQuestions) * 100
  );

  const nextQuestion = () => {
    if (!answers[currentQuestion._id])
      return alert("দয়া করে উত্তর দিন!");

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleSubmit = () => {
    const answerList = filteredQuestions.map((q) => ({
      questionId: q._id,
      type: q.answerType,
      givenAnswer: answers[q._id] || "",
      isCorrect:
        q.answerType === "mcq" &&
        answers[q._id] === q.answer.correct,
      marks:
        q.answerType === "mcq" &&
        answers[q._id] === q.answer.correct
          ? q.marks
          : 0,
    }));

    const totalMarks = answerList.reduce((acc, q) => acc + q.marks, 0);

    const payload = {
      examId,
      examType,
      totalMarks,
      answers: answerList,
    };

    setResult(payload);

    console.log("FINAL SUBMISSION PAYLOAD:", payload);

    Swal.fire({
      title: "Exam Completed!",
      text: `You obtained: ${totalMarks} marks`,
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  useEffect(() => {
    if (timeUp) handleSubmit();
  }, [timeUp]);

  return (
    <div className="p-5 max-w-3xl mx-auto">

      {/* EXAM TITLE */}
      <h1 className="text-2xl font-bold text-center mb-3">
        Exam ID: {examId}
      </h1>

      {/* TIMER */}
      <Timer minutes={exam.duration_minutes} onTimeUp={() => setTimeUp(true)} />

      {/* CATEGORY SELECT */}
      <div className="mt-5 flex justify-center">
        <select
          value={examType}
          onChange={(e) => {
            setExamType(e.target.value as "mcq" | "written");
            setCurrentIndex(0);
            setAnswers({});
          }}
          className="border px-3 py-2 rounded w-48"
        >
          <option value="mcq">MCQ</option>
          <option value="written">উত্তর লিখুন</option>
        </select>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full bg-gray-200 h-3 rounded mt-5">
        <div
          className="bg-green-500 h-3 rounded"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <p className="text-center mt-1 text-sm font-semibold">
        {progressPercent}% Completed
      </p>

      {/* QUESTION */}
      <div className="mt-6">
        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          answer={answers[currentQuestion._id] || ""}
          onAnswer={handleAnswer}
        />
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between mt-6">
        <button
          onClick={previousQuestion}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded ${
            currentIndex === 0 ? "bg-gray-300" : "bg-gray-600 text-white"
          }`}
        >
          ← Previous
        </button>

        <button
          onClick={nextQuestion}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          {currentIndex === totalQuestions - 1 ? "Submit" : "Next →"}
        </button>
      </div>

      {result && (
        <div className="mt-5 bg-green-100 p-4 rounded">
          <h2 className="text-xl font-bold">Exam Summary</h2>
          <p>Total Marks: {result.totalMarks}</p>
        </div>
      )}
    </div>
  );
}
