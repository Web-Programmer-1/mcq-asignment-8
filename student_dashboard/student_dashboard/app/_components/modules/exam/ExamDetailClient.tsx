


"use client";

import { useSearchParams } from "next/navigation";
import  { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaCheckDouble,
  FaBook,
  FaUser,
  FaPhone,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import getCookie from "@/app/util/GetCookie";
import Swal from "sweetalert2";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL!;
const RESULT_API_URL = `${BACKEND_URL}/results/`;

export default function ExamDetailsClient() {
  const params = useSearchParams();
  const examNumber = params.get("exam");

  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showTimer, setShowTimer] = useState(true);
  const [timeUp, setTimeUp] = useState(false);

  const studentInfo = {
    name: "Md hakim",
    phone: "01712345672",
  };

  useEffect(() => {
    if (examNumber) fetchExam();
  }, [examNumber]);

  async function fetchExam() {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/exam/${examNumber}`, {
        method: "GET",
        headers: {
          Authorization: getCookie("access_token") || "",
        },
      });

      const json = await res.json();
      if (json.success) setExam(json.data);
    } catch (e) {
      console.log("Exam Fetch Error:", e);
    }
    setLoading(false);
  }

  function handleAnswerChange(questionId: string, selectedAnswer: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  function handlePrevQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  function jumpToQuestion(index: number) {
    setCurrentQuestionIndex(index);
  }

  const handleTimeUp = () => {
    setTimeUp(true);
    setShowTimer(false);
    Swal.fire({
      title: "Time's Up!",
      text: "Your time has expired. Submitting your exam...",
      icon: "warning",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      handleSubmitExam();
    });
  };

  async function handleSubmitExam() {
    if (!exam) return;
    
    setIsSubmitting(true);
    setShowTimer(false); 
    
  
    const unansweredCount = exam.questions.length - Object.keys(answers).length;
    
    const confirmResult = await Swal.fire({
      title: "Submit Exam?",
      html: `
        <div class="text-left">
          <p class="mb-3">Are you sure you want to submit the exam?</p>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <p class="font-semibold text-yellow-800 mb-2">Summary:</p>
            <div class="space-y-1">
              <p class="text-sm">✅ Answered: ${Object.keys(answers).length} questions</p>
              <p class="text-sm">❓ Unanswered: ${unansweredCount} questions</p>
              <p class="text-sm">📝 Total: ${exam.questions.length} questions</p>
            </div>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit Now!",
      cancelButtonText: "No, Continue Exam",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      backdrop: true,
      allowOutsideClick: false,
    });

    if (!confirmResult.isConfirmed) {
      setIsSubmitting(false);
      setShowTimer(true);
      return;
    }

    // Calculate result
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    let score = 0;

    const writtenExam: Array<{ question: string; answer: string }> = [];

    exam.questions.forEach((q: any) => {
      const userAnswer = answers[q.questionId];

      writtenExam.push({
        question: q.title,
        answer: userAnswer || "Not answered",
      });

      if (!userAnswer || userAnswer.trim() === "") {
        unanswered++;
      } else if (userAnswer === q.answer?.correctAnswer) {
        correctAnswers++;
        score += q.marks || 1;
      } else {
        wrongAnswers++;
      }
    });

    // Prepare payload
    const resultPayload = {
      student_name: studentInfo.name,
      student_phone: studentInfo.phone,
      exam_number: exam.exam_number,
      score,
      totalQuestions: exam.questions.length,
      correctAnswers,
      wrongAnswers,
      unanswered,
      is_cheated: false,
      is_on_time: !timeUp,
      writtenExam,
    };

    console.log("Submitting result:", resultPayload);

    // Show loading
    Swal.fire({
      title: "Submitting...",
      text: "Please wait while we process your exam",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch(RESULT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getCookie("access_token") || "",
        },
        body: JSON.stringify(resultPayload),
      });

      const data = await res.json();
      Swal.close();

      if (res.ok) {
        // Success alert with results
        await Swal.fire({
          title: "🎉 Exam Submitted!",
          html: `
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-24 h-24 bg-linear-to-r from-green-400 to-emerald-500 rounded-full mb-6">
                <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h3>
              <p class="text-gray-600 mb-6">Your exam has been submitted successfully.</p>
              
              <div class="bg-linear-to-r from-emerald-50 to-green-50 p-6 rounded-2xl border border-green-100 mb-6">
                <div class="grid grid-cols-3 gap-4">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-green-600">${score}</div>
                    <div class="text-sm text-gray-600">Score</div>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-blue-600">${correctAnswers}</div>
                    <div class="text-sm text-gray-600">Correct</div>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-red-600">${wrongAnswers}</div>
                    <div class="text-sm text-gray-600">Wrong</div>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t border-green-200">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Total Questions: ${exam.questions.length}</span>
                    <span class="text-gray-600">Unanswered: ${unanswered}</span>
                  </div>
                </div>
              </div>
              
              <p class="text-sm text-gray-500">Redirecting to results page...</p>
            </div>
          `,
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        // Redirect to results page
        setTimeout(() => {
          window.location.href =`/exam`;
        }, 3000);
      } else {
        // Error alert
        await Swal.fire({
          title: "Submission Failed",
          html: `
            <div class="text-left">
              <p class="mb-3">We couldn't submit your exam. Please try again.</p>
              <div class="bg-red-50 p-4 rounded-lg text-sm">
                <p><strong>Error:</strong> ${data.message || "Server Error"}</p>
              </div>
            </div>
          `,
          icon: "error",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#ef4444",
          showCancelButton: true,
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            handleSubmitExam();
          } else {
            setShowTimer(true);
          }
        });
      }
    } catch (error) {
      Swal.close();
      await Swal.fire({
        title: "Network Error",
        text: "Please check your internet connection and try again.",
        icon: "warning",
        confirmButtonText: "Retry",
        confirmButtonColor: "#f59e0b",
      }).then((result) => {
        if (result.isConfirmed) {
          handleSubmitExam();
        } else {
          setShowTimer(true);
        }
      });
    }

    setIsSubmitting(false);
  }

  if (!examNumber)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-emerald-50 to-teal-100">
        <div className="text-center p-10 bg-white rounded-2xl shadow-2xl">
          <p className="text-xl text-gray-700 font-semibold">
            Invalid Exam Number
          </p>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-slate-50 via-emerald-50 to-teal-100">
        <div className="relative">
          <div className="h-20 w-20 border-4 border-green-200 rounded-full"></div>
          <div className="h-20 w-20 border-t-4 border-green-600 rounded-full animate-spin absolute top-0"></div>
          <p className="mt-6 text-green-600 font-semibold">Loading Exam...</p>
        </div>
      </div>
    );

  const currentQuestion = exam.questions[currentQuestionIndex];
  const totalQuestions = exam.questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
   
      {showTimer && exam && (
        <ExamTimer
          durationMinutes={exam.duration_minutes}
          onTimeUp={handleTimeUp}
        />
      )}

      {/* Top Header Bar */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <button
                onClick={() => (window.location.href = "/dashboard/exam/list")}
                className="p-2 bg-gray-100 hover:bg-green-600 hover:text-white rounded-lg transition-all"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {exam.exam_name}
                </h1>
                <p className="text-sm text-gray-600">
                  Exam #{exam.exam_number}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaUser className="text-green-600" />
                  <span className="font-medium">{studentInfo.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-green-600" />
                  <span>{studentInfo.phone}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentQuestionIndex + 1}
                  </div>
                  <div className="text-xs text-gray-600">of {totalQuestions}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {answeredCount} of {totalQuestions} answered
            </span>
            <span className="text-sm font-bold text-green-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content - Single Question View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Question */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              {/* Question Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm rounded-full font-bold">
                      Question {currentQuestionIndex + 1}
                    </span>
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-800 text-sm rounded-full font-bold">
                      {currentQuestion.marks || 1} Mark
                      {currentQuestion.marks !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {currentQuestion.title}
                  </h2>
                </div>
              </div>

              {/* Question Description */}
              {currentQuestion.description && (
                <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-gray-700">{currentQuestion.description}</p>
                </div>
              )}

              {/* Math Formula */}
              {currentQuestion.mathFormula && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-800 mb-4">
                    Mathematical Formula
                  </h3>
                  <div className="text-center">
                    <BlockMath math={currentQuestion.mathFormula} />
                  </div>
                </div>
              )}

              {/* Question Details */}
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Question ID</p>
                  <p className="font-mono font-bold">{currentQuestion.questionId}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-semibold capitalize">{currentQuestion.type}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Answer Type</p>
                  <p className="font-semibold">{currentQuestion.answerType || "Multiple Choice"}</p>
                </div>
              </div>

              {/* Answer Section */}
              <QuestionAnswerSection
                question={currentQuestion}
                userAnswer={answers[currentQuestion.questionId]}
                onAnswerChange={handleAnswerChange}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 bg-white rounded-xl shadow p-6">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
              >
                <FaChevronLeft />
                Previous Question
              </button>

              <div className="flex items-center gap-4">
                {answeredCount === totalQuestions ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <FaCheckCircle />
                    <span className="font-semibold">All questions answered</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-orange-600">
                    <FaQuestionCircle />
                    <span className="font-semibold">
                      {totalQuestions - answeredCount} questions remaining
                    </span>
                  </div>
                )}
              </div>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 rounded-lg font-medium transition-all"
                >
                  Next Question
                  <FaChevronRight />
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white hover:opacity-90 disabled:opacity-50 rounded-lg font-bold transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Exam"
                  )}
                </button>
              )}
            </div>
          </div>

       
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Questions ({totalQuestions})
              </h3>

              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-3">
                {exam.questions.map((q: any, index: number) => {
                  const isAnswered = answers[q.questionId];
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={q._id}
                      onClick={() => jumpToQuestion(index)}
                      className={`
                        aspect-square flex items-center justify-center rounded-lg font-bold transition-all
                        ${isCurrent
                          ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg scale-105"
                          : isAnswered
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-700"></div>
                  <span className="text-sm">Current Question</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-100 border-2 border-green-500"></div>
                  <span className="text-sm">Answered</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-100 border-2 border-gray-400"></div>
                  <span className="text-sm">Unanswered</span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-bold text-gray-900 mb-4">Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-bold">{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Answered:</span>
                    <span className="font-bold">{answeredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Unanswered:</span>
                    <span className="font-bold">{totalQuestions - answeredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Current:</span>
                    <span className="font-bold">{currentQuestionIndex + 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------
   TIMER COMPONENT
--------------------------------------- */
function ExamTimer({
  durationMinutes,
  onTimeUp,
}: {
  durationMinutes: number;
  onTimeUp: () => void;
}) {
  const [seconds, setSeconds] = useState(durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    if (seconds <= 0) {
      setIsRunning(false);
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, isRunning, onTimeUp]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const percentage = (seconds / (durationMinutes * 60)) * 100;

  // Auto hide when less than 10 seconds
  if (seconds <= 10) {
    return (
      <div className="fixed top-4 right-4 z-50 animate-pulse">
        <div className="p-4 bg-red-600 text-white rounded-lg shadow-2xl">
          <div className="text-center">
            <p className="text-sm font-semibold">⏰ FINAL COUNTDOWN!</p>
            <p className="text-3xl font-bold font-mono">
              {minutes.toString().padStart(2, "0")}:
              {secs.toString().padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`p-4 rounded-lg shadow-2xl ${
          percentage < 20
            ? "bg-red-500"
            : percentage < 50
            ? "bg-orange-500"
            : "bg-green-500"
        } text-white`}
      >
        <div className="text-center">
          <p className="text-sm font-semibold">Time Remaining</p>
          <p className="text-2xl font-bold font-mono">
            {minutes.toString().padStart(2, "0")}:
            {secs.toString().padStart(2, "0")}
          </p>
          <div className="w-full bg-white/30 h-2 rounded-full mt-2">
            <div
              className={`h-full rounded-full ${
                percentage < 20
                  ? "bg-red-300"
                  : percentage < 50
                  ? "bg-orange-300"
                  : "bg-green-300"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------
   QUESTION ANSWER SECTION
--------------------------------------- */
function QuestionAnswerSection({
  question,
  userAnswer,
  onAnswerChange,
}: {
  question: any;
  userAnswer: string;
  onAnswerChange: (questionId: string, answer: string) => void;
}) {
  const isWrittenQuestion =
    !question.answer?.options || question.answer?.options.length === 0;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {isWrittenQuestion ? "Write Your Answer" : "Select Your Answer"}
        </h3>
        {userAnswer && (
          <div className="flex items-center gap-2 text-green-600">
            <FaCheckCircle />
            <span className="font-semibold">Answered</span>
          </div>
        )}
      </div>

      {isWrittenQuestion ? (
        <div className="space-y-4">
          <textarea
            className="w-full h-48 p-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            placeholder="Type your detailed answer here..."
            value={userAnswer || ""}
            onChange={(e) => onAnswerChange(question.questionId, e.target.value)}
          />
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a written question. Please provide
              a detailed and complete answer.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {question.answer?.options?.map((opt: string, i: number) => {
            const optionLetter = String.fromCharCode(65 + i); // A, B, C, D
            return (
              <label
                key={i}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  userAnswer === opt
                    ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.questionId}`}
                  value={opt}
                  checked={userAnswer === opt}
                  onChange={() => onAnswerChange(question.questionId, opt)}
                  className="mt-1 h-5 w-5 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        userAnswer === opt
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {optionLetter}
                    </span>
                    <span className="font-medium text-gray-900">{opt}</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {/* Current Answer Display */}
      {userAnswer && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-semibold text-blue-800">Your Answer:</span>
          </div>
          <p className="mt-2 text-gray-800">{userAnswer}</p>
        </div>
      )}
    </div>
  );
}























