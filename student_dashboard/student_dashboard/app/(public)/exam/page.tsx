"use client";



import getCookie from "@/app/util/GetCookie";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaCalendarAlt,
  FaClock,
  FaCheckDouble,
  FaBook,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Swal from "sweetalert2";


const Toggle = ({ enabled, onChange }:{ enabled: boolean; onChange: (enabled: boolean) => void;}) => (
  <div
    onClick={() => onChange(!enabled)}
    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition ${
      enabled ? "bg-green-500" : "bg-gray-300"
    }`}
  >
    <div
      className={`bg-white w-6 h-6 rounded-full shadow transform transition ${
        enabled ? "translate-x-7" : ""
      }`}
    />
  </div>
);

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL!;
interface Exam {
  _id: string;
  exam_name: string;
  exam_number: string;
  exam_date_time: string;
  duration_minutes: number;
  total_marks: number;
  questions?: any[];
  is_published: boolean;
  is_started: boolean;
  is_completed: boolean;
}

export default function ModernExamList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  console.log("SearchTerm", searchTerm);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modal States
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showModal, setShowModal] = useState(false);

  const limit = 6; // Cards per page

  // Fetch Exams from Backend
  useEffect(() => {
    fetchExams(1, "");
  }, []);

  const fetchExams = async (currentPage: number, search:string) => {
    setLoading(true);

    const base_url = process.env.NEXT_PUBLIC_BASE_URL!;

    try {
      const url = `${base_url}/exam?page=${currentPage}&limit=${limit}&searchTerm=${search}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: getCookie("access_token") || "" },
      });

      const result = await response.json();

      console.log("Exam List CheckData", result)

      if (result.success) {
        setExams(result.data.data);
        setTotalPages(result.data.meta.totalPage);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      Swal.fire({ icon: "error", title: "Failed to load exams" });
    }

    setLoading(false);
  };

  // SEARCH
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
    fetchExams(1, value);
  };

  // PAGINATION
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchExams(newPage, searchTerm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE
  const handleDelete = async (examNumber:any) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This exam will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/exam/${examNumber}`, {
        method: "DELETE",
        headers: { Authorization: getCookie("access_token") || "" },
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchExams(page, searchTerm);
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Delete failed" });
    }
  };

  // MODAL OPEN
  const openStatusModal = (exam:any) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  // UPDATE STATUS
  const updateStatus = async () => {
    if (!selectedExam) return;

    const payload = {
      is_published: selectedExam.is_published,
      is_started: selectedExam.is_started,
      is_completed: selectedExam.is_completed,
    };

    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/exam/${selectedExam.exam_number}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: getCookie("access_token") || "",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Status Updated!",
          timer: 1500,
          showConfirmButton: false,
        });

        setShowModal(false);
        fetchExams(page, searchTerm);
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Update Failed!" });
    }
  };

  const formatDate = (date:any) =>
    new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (exam:any) => {
    if (exam.is_completed) {
      return (
        <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-md">
          Completed
        </span>
      );
    } else if (exam.is_started) {
      return (
        <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-md">
          Started
        </span>
      );
    } else if (exam.is_published) {
      return (
        <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold rounded-full shadow-md">
          Published
        </span>
      );
    } else {
      return (
        <span className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xs font-bold rounded-full shadow-md">
          Draft
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="bg-linear-to-r mt-20 from-green-600 to-emerald-700 p-8 rounded-2xl shadow-2xl mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Exam Management</h1>
              <p className="text-green-100 text-lg">Manage and organize all your exams</p>
            </div>

            <Link href="/">
              <button className="flex items-center gap-3 bg-white text-green-600 px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold">
              Back To Home
              </button>
            </Link>
          </div>
        </div>

        {/* COLLAPSIBLE FILTER SECTION */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl mb-8 overflow-hidden border border-white/50">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-between p-6 hover:bg-emerald-50 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <FaFilter className="text-white" size={20} />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-gray-800">Search & Filter</h2>
                <p className="text-gray-500 text-sm">Find exams quickly</p>
              </div>
            </div>
            
            <div className="p-2 bg-emerald-100 rounded-lg">
              {isFilterOpen ? (
                <FaChevronUp className="text-green-600" size={20} />
              ) : (
                <FaChevronDown className="text-green-600" size={20} />
              )}
            </div>
          </button>

          {isFilterOpen && (
            <div className="p-6 pt-0 border-t border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by exam name or number..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-gray-700 font-medium"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FaSearch className="absolute left-4 top-5 text-gray-400" size={20} />
              </div>
            </div>
          )}
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="h-24 w-24 border-4 border-green-200 rounded-full"></div>
              <div className="h-24 w-24 border-t-4 border-green-600 rounded-full animate-spin absolute top-0"></div>
            </div>
          </div>
        ) : (
          <>
            {/* EXAM CARDS GRID */}
            {exams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {exams.map((exam) => (
                  <div
                    key={exam._id}
                    className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-white/50"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1 line-clamp-2">{exam.exam_name}</h3>
                          <p className="text-green-100 text-sm font-mono">#{exam.exam_number}</p>
                        </div>
                        {getStatusBadge(exam)}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FaCalendarAlt className="text-blue-600" size={16} />
                            <p className="text-xs font-semibold text-blue-800">Date & Time</p>
                          </div>
                          <p className="text-sm font-bold text-gray-800">{formatDate(exam.exam_date_time).split(',')[0]}</p>
                          <p className="text-xs text-gray-600">{formatDate(exam.exam_date_time).split(',')[1]}</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FaClock className="text-purple-600" size={16} />
                            <p className="text-xs font-semibold text-purple-800">Duration</p>
                          </div>
                          <p className="text-xl font-bold text-gray-800">{exam.duration_minutes}</p>
                          <p className="text-xs text-gray-600">minutes</p>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FaCheckDouble className="text-emerald-600" size={16} />
                            <p className="text-xs font-semibold text-emerald-800">Total Marks</p>
                          </div>
                          <p className="text-xl font-bold text-gray-800">{exam.total_marks}</p>
                          <p className="text-xs text-gray-600">points</p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
                          <div className="flex items-center gap-2 mb-2">
                            <FaBook className="text-orange-600" size={16} />
                            <p className="text-xs font-semibold text-orange-800">Questions</p>
                          </div>
                          <p className="text-xl font-bold text-gray-800">{exam.questions?.length || 0}</p>
                          <p className="text-xs text-gray-600">total</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => (window.location.href = `/exam/details?exam=${exam.exam_number}`)}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <FaEye size={16} /> View
                        </button>

                   

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-block p-8 bg-white rounded-2xl shadow-xl">
                  <FaBook className="mx-auto text-gray-300 mb-4" size={64} />
                  <p className="text-gray-500 text-xl font-semibold">No exams found</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
                </div>
              </div>
            )}

            {/* PAGINATION */}
            {exams.length > 0 && (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/50">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                  >
                    <FaChevronLeft /> Previous
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-bold text-lg">
                      Page <span className="text-green-600">{page}</span> of <span className="text-green-600">{totalPages}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* STATUS UPDATE MODAL */}
      {showModal && selectedExam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
              <h2 className="text-2xl font-bold">Update Exam Status</h2>
              <p className="text-green-100 text-sm mt-1">{selectedExam.exam_name}</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div>
                  <span className="text-lg font-bold text-gray-800">Published</span>
                  <p className="text-xs text-gray-600 mt-1">Make exam visible to students</p>
                </div>
                <Toggle
                  enabled={selectedExam.is_published}
                  onChange={(v) =>
                    setSelectedExam({
                      ...selectedExam,
                      is_published: v,
                      is_started: false,
                      is_completed: false,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div>
                  <span className="text-lg font-bold text-gray-800">Started</span>
                  <p className="text-xs text-gray-600 mt-1">Exam is currently active</p>
                </div>
                <Toggle
                  enabled={selectedExam.is_started}
                  onChange={(v) =>
                    setSelectedExam({
                      ...selectedExam,
                      is_started: v,
                      is_published: false,
                      is_completed: false,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div>
                  <span className="text-lg font-bold text-gray-800">Completed</span>
                  <p className="text-xs text-gray-600 mt-1">Exam has finished</p>
                </div>
                <Toggle
                  enabled={selectedExam.is_completed}
                  onChange={(v) =>
                    setSelectedExam({
                      ...selectedExam,
                      is_completed: v,
                      is_started: false,
                      is_published: false,
                    })
                  }
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-100 font-semibold transition-all duration-300"
              >
                Cancel
              </button>

              <button
                onClick={updateStatus}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg font-semibold transition-all duration-300"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
















