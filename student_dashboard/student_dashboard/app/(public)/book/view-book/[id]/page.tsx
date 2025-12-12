
"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Globe,
  DollarSign,
  Calendar,
  User,
  BookOpen,
  Tag,
  Eye,
  Download,
  Share2,
  Bookmark,
  CheckCircle,
  XCircle,
  ExternalLink,
  Printer,
  Clock,
  FileText,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";


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
  updated_at?: string;
  views?: number;
  downloads?: number;
  isbn?: string;
  publisher?: string;
  language?: string;
  pages?: number;
  file_size?: string;
  file_format?: string;
  sample_url?: string;
  full_book_url?: string;
  tags?: string[];
  rating?: number;
  review_count?: number;
  buy_url?: string;
}

const base_url = process.env.NEXT_PUBLIC_BASE_URL!;


export default function ViewBookDetails() {
  const router = useRouter();
  const params = useParams();
  const bookNumber = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  const [imageLoading, setImageLoading] = useState(true);

  const token = getCookie("access_token");

  // ============================
  // FETCH SINGLE BOOK
  // ============================
  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      
      const res = await fetch(`${base_url}/books/${bookNumber}`, {
        headers: {
          Authorization: token || "",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch book details");
      }

      const response = await res.json();
      console.log("📖 Book Details:", response);
      
      setBook(response.data);
      
      // Fetch related books (same category or author)
      fetchRelatedBooks(response.data.category, response.data.author);
    } catch (err: any) {
      console.error("❌ Error fetching book:", err.message);
      Swal.fire({
        title: "Error",
        text: "Failed to load book details",
        icon: "error",
        confirmButtonColor: "#ef4444",
        customClass: { popup: "rounded-2xl" }
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // FETCH RELATED BOOKS
  // ============================
  const fetchRelatedBooks = async (category?: string, author?: string) => {
    try {
      let query = "";
      if (category) query += `category=${category}`;
      if (author) query += query ? `&author=${author}` : `author=${author}`;
      
      if (!query) return;

      const res = await fetch(`${base_url}/books?${query}&limit=4`, {
        headers: {
          Authorization: token || "",
        },
      });

      if (res.ok) {
        const response = await res.json();
        // Filter out current book from related books
        const filtered = response.data?.data?.filter(
          (b: Book) => b.book_number.toString() !== bookNumber
        ) || [];
        setRelatedBooks(filtered.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching related books:", err);
    }
  };

  // ============================
  // PLATFORM BADGE
  // ============================
  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "rokomari":
        return (
          <span className="px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r from-teal-500 to-emerald-500 shadow-md">
            <Globe className="w-4 h-4 inline mr-2" />
            Rokomari
          </span>
        );
      case "wafi_life":
        return (
          <span className="px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md">
            <Globe className="w-4 h-4 inline mr-2" />
            Wafi Life
          </span>
        );
      default:
        return (
          <span className="px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r from-gray-600 to-gray-700 shadow-md">
            <Globe className="w-4 h-4 inline mr-2" />
            {platform}
          </span>
        );
    }
  };

  // ============================
  // FORMAT DATE
  // ============================
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ============================
  // SHARE BOOK
  // ============================
  const handleShare = async () => {
    if (!book) return;

    const shareData = {
      title: book.title,
      text: `Check out "${book.title}" on our platform!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        title: "Copied!",
        text: "Link copied to clipboard",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl" }
      });
    }
  };

  // ============================
  // DOWNLOAD SAMPLE
  // ============================
  const handleDownloadSample = () => {
    if (!book?.sample_url) {
      Swal.fire({
        title: "Not Available",
        text: "Sample not available for this book",
        icon: "info",
        customClass: { popup: "rounded-2xl" }
      });
      return;
    }

    window.open(book.sample_url, "_blank");
  };

  // ============================
  // VIEW FULL BOOK
  // ============================
  const handleViewFullBook = () => {
    if (!book?.full_book_url) {
      Swal.fire({
        title: "Not Available",
        text: "Full book not available",
        icon: "info",
        customClass: { popup: "rounded-2xl" }
      });
      return;
    }

    window.open(book.full_book_url, "_blank");
  };

  // ============================
  // PRINT DETAILS
  // ============================
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (bookNumber) {
      fetchBookDetails();
    }
  }, [bookNumber]);

  // ============================
  // LOADING SKELETON
  // ============================
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:mt-12">
          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded-xl w-48 mb-6"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-32 mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Book Not Found</h3>
          <p className="text-gray-500 mb-6">The requested book does not exist or has been removed.</p>
          <button
            onClick={() => router.push("/dashboard/my-book")}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-600 transition-all duration-300"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Books
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-teal-600 transition-colors"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-teal-600 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Book Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{book.title}</h1>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${book.is_published ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {book.is_published ? 'Published' : 'Draft'}
            </span>
          </div>
          <p className="text-gray-500">Book ID: #{book.book_number}</p>
        </div>

        {/* Book Details Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Image and Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              
              {/* Book Cover */}
              <div className="relative mb-6">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={book.thumbnail_url || "/api/placeholder/400/500"}
                    alt={book.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setImageLoading(false)}
                  />
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Eye className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-800">{book.views || 0}</div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Download className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-800">{book.downloads || 0}</div>
                    <div className="text-xs text-gray-500">Downloads</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bookmark className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-800">{book.rating || "N/A"}</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
               <Link href={book.buy_url || "/book"}>
                         <button
                
                  className="w-full bg-linear-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Book View Link
                </button>
               </Link>
       

                {/* Price Display */}
                <div className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Price</div>
                      <div className="text-2xl font-bold text-gray-800 flex items-center">
                        <DollarSign className="w-6 h-6 text-teal-600" />
                        {book.price}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Platform</div>
                      {getPlatformBadge(book.sold_platform)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

 
        </div>

        {/* Action Footer */}
        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={() => router.push("/book")}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-teal-500 hover:text-teal-600 transition-all duration-300"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}