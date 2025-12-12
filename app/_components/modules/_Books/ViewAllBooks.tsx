"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  BookOpen,
  DollarSign,
  Globe,
  Calendar,
  User,
  MoreVertical,
} from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


// COOKIE FUNCTION
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

interface Book {
  book_number: number;
  title: string;
  description: string;
  thumbnail_url: string;
  sold_platform: string;
  price: number;
  is_published: boolean;
  author?: string;
  category?: string;
  created_at?: string;
  views?: number;
}


const base_url = process.env.NEXT_PUBLIC_BASE_URL!;
export default function ViewAllBooks() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const token = getCookie("access_token");


  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "rokomari":
        return (
          <span className="px-3 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r from-teal-500 to-emerald-500 shadow-sm">
            Rokomari
          </span>
        );

      case "wafi_life":
        return (
          <span className="px-3 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 shadow-sm">
            Wafi Life
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r from-gray-500 to-gray-700 shadow-sm">
            Others
          </span>
        );
    }
  };

  // ============================
  // GET SINGLE BOOK BY ID
  // ============================
  const getSingleBook = async (bookNumber: number) => {
    try {
      const res = await fetch(`${base_url}/books/${bookNumber}`, {
        headers: {
          Authorization: token || "",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch book details");
      }

      const data = await res.json();
      setSelectedBook(data.data);
      
      // Open modal or navigate to view page
      router.push(`/book/view-book/${bookNumber}`);
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // ============================
  // LOAD BOOKS
  // ============================
  const getAllBooks = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${base_url}/books?page=${page}&limit=${limit}&searchTerm=${search}`,
        {
          headers: {
            Authorization: token || "",
          },
        }
      );

      const response = await res.json();
      console.log("📚 API Response:", response);

      const safeBooks: Book[] = [...(response?.data?.data || [])];

      setBooks(safeBooks);
      setTotal(response?.data?.meta?.total || safeBooks.length);
    } catch (err: any) {
      console.error("❌ ERROR:", err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBooks();
  }, [page, limit, search]);


  // ============================
  // TOGGLE PUBLISH
  // ============================
//   const handleToggle = async (book_number: number) => {
//     Swal.fire({
//       title: "Updating...",
//       allowOutsideClick: false,
//       didOpen: () => Swal.showLoading(),
//       customClass: {
//         popup: "rounded-2xl"
//       }
//     });

//     try {
//       const res = await fetch(`${base_url}/books/${book_number}`, {
//         method: "PATCH",
//         headers: { Authorization: token || "" },
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message);
//       }

//       Swal.close();
//       Swal.fire({
//         title: "Updated!",
//         text: "Publish status changed.",
//         icon: "success",
//         confirmButtonColor: "#10b981",
//         customClass: {
//           popup: "rounded-2xl"
//         }
//       });
//       getAllBooks();
//     } catch (err: any) {
//       Swal.close();
//       Swal.fire({
//         title: "Error",
//         text: err.message,
//         icon: "error",
//         confirmButtonColor: "#ef4444",
//         customClass: {
//           popup: "rounded-2xl"
//         }
//       });
//     }
//   };

  const totalPages = Math.ceil(total / limit);

  // ============================
  // CARD VIEW COMPONENT
  // ============================
  const BookCard = ({ book }: { book: Book }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl   transition-all duration-300 overflow-hidden border border-gray-100 hover:border-teal-100 group">
      
      {/* Thumbnail Section */}
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={book.thumbnail_url || "/api/placeholder/400/250"}
          alt={book.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {book.is_published ? (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
              Published
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
              Draft
            </span>
          )}
        </div>

        {/* ID Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-gray-700">#{book.book_number}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors">
          {book.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {book.description?.replace(/<[^>]*>/g, '') || "No description available"}
        </p>

        {/* Platform and Price Row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {getPlatformBadge(book.sold_platform)}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-lg text-gray-800">৳ {book.price}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {/* View Button */}
          <button
            onClick={() => getSingleBook(book.book_number)}
            className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2.5 rounded-xl font-medium hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          {/* More Actions Dropdown */}
          <div className="relative group/more">
            <button className="w-12 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center">
              <MoreVertical className="w-5 h-5" />
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all duration-200 z-10">
              <button
                onClick={() => router.push(`/dashboard/my-book/update-book/${book.book_number}`)}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-teal-50 hover:text-teal-600 flex items-center gap-3 rounded-t-xl"
              >
                <Edit className="w-4 h-4" />
                Edit Book
              </button>
              
              <button
           
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-teal-50 hover:text-teal-600 flex items-center gap-3"
              >
                {book.is_published ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Publish
                  </>
                )}
              </button>
              
      
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================
  // LOADING SKELETON
  // ============================
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-5 space-y-4">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="flex justify-between pt-4">
              <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Header Section */}
      <div className="bg-linear-to-r max-w-7xl mx-auto from-teal-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Book Management</h1>
              <p className="text-teal-100 text-lg">Browse, manage, and organize your book collection</p>
            </div>
 
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search books by title, author, or description..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-xl hover:border-teal-500 hover:text-teal-600 transition-colors font-medium"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {/* Results Count */}
            <div className="text-gray-600 font-medium">
              {total} books found
            </div>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Page Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items Per Page
                  </label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    value={limit}
                    onChange={(e) => {
                      setPage(1);
                      setLimit(Number(e.target.value));
                    }}
                  >
                    <option value={6}>6 items</option>
                    <option value={9}>9 items</option>
                    <option value={12}>12 items</option>
                    <option value={15}>15 items</option>
                  </select>
                </div>

                {/* Page Navigation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Page
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      value={page}
                      min={1}
                      max={totalPages}
                      onChange={(e) => setPage(Number(e.target.value))}
                    />
                    <span className="text-gray-500">of {totalPages}</span>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setPage(1);
                      setLimit(9);
                      setSearch("");
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Books Grid */}
        <div className="mb-8">
          {loading ? (
            <LoadingSkeleton />
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Books Found</h3>
                <p className="text-gray-500 mb-6">
                  {search ? "Try adjusting your search terms" : "Get started by adding your first book"}
                </p>
                <button
                  onClick={() => router.push("/dashboard/my-book/create-book")}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Create First Book
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book.book_number} book={book} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {books.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            
            {/* Results Info */}
            <div className="text-gray-600">
              Showing <span className="font-bold">{(page - 1) * limit + 1}</span> – 
              <span className="font-bold"> {Math.min(page * limit, total)}</span> of 
              <span className="font-bold"> {total}</span> books
            </div>

            {/* Page Controls */}
            <div className="flex items-center gap-2">
              
              {/* Previous Button */}
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-teal-50 hover:text-teal-600 border border-gray-200 hover:border-teal-200"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-12 h-12 rounded-xl font-medium transition-all ${
                        page === pageNum
                          ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                  page >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-teal-50 hover:text-teal-600 border border-gray-200 hover:border-teal-200"
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{total}</div>
              <div className="text-gray-300">Total Books</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {books.filter(b => b.is_published).length}
              </div>
              <div className="text-gray-300">Published</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {books.filter(b => !b.is_published).length}
              </div>
              <div className="text-gray-300">In Draft</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}