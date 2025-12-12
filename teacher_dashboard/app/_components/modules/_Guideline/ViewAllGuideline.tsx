"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

import getCookie from "@/app/util/GetCookie";


// Date formatter
const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ViewAllGuideline() {
  const router = useRouter();

  const [guidelines, setGuidelines] = useState<any[]>([]);

  console.log("Guideline", guidelines)
  const [loading, setLoading] = useState(true);


  const [searchTerm, setSearchTerm] = useState("");


  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPage, setTotalPage] = useState(1);


  const [showFilters, setShowFilters] = useState(false);

  // FETCH FUNCTION
  const fetchGuidelines = async () => {
    setLoading(true);
      const base_url = process.env.NEXT_PUBLIC_BASE_URL!;
    const url = `${base_url}/guideline?page=${page}&limit=${limit}&searchTerm=${searchTerm}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: getCookie("access_token") || "",
        },
      });

      const data = await res.json();

      console.log("Guideline CheckData", data)

      if (res.ok) {
        setGuidelines(data.data.data);
        setTotalPage(data.data.meta.totalPage);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // Auto fetch on page/limit change
  useEffect(() => {
    fetchGuidelines();
  }, [page, limit]);

  // Search button click
  const handleSearchClick = () => {
    setPage(1);
    fetchGuidelines();
  };

  // Press enter to search
  const handleSearchEnter = (e: any) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchGuidelines();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br max-w-[1400px] mx-auto mt-20  p-6">
      
      {/* HEADER */}
      <div className="bg-linear-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white p-8 rounded-3xl shadow-2xl mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={40} />
          <h1 className="text-4xl font-bold">All Guidelines</h1>
        </div>
        <p className="text-teal-100 text-lg">Browse and explore our comprehensive guideline collection</p>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        
        {/* Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* SEARCH INPUT */}
          <div className="md:col-span-2 flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 bg-gray-50 focus-within:border-teal-500 transition-all">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search guidelines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchEnter}
              className="py-3 outline-none w-full bg-transparent"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={handleSearchClick}
              className="flex-1 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl px-6 py-3 font-semibold shadow-md transition-all"
            >
              Search
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 border-2 border-teal-600 rounded-xl px-4 py-3 text-teal-700 font-semibold hover:bg-teal-50 transition-all"
            >
              <Filter size={18} />
              {showFilters ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>
        </div>

        {/* COLLAPSIBLE FILTER SECTION */}
        {showFilters && (
          <div className="mt-6 border-t-2 border-gray-100 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* PAGE Selector */}
              <div>
                <label className="font-semibold text-gray-700 mb-2 block">Page Number</label>
                <input
                  type="number"
                  min={1}
                  value={page}
                  onChange={(e) => setPage(Number(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-teal-500 outline-none"
                />
              </div>

              {/* LIMIT Selector */}
              <div>
                <label className="font-semibold text-gray-700 mb-2 block">Items Per Page</label>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-teal-500 outline-none"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>

              {/* APPLY BUTTON */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setPage(1);
                    fetchGuidelines();
                  }}
                  className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl px-4 py-3 font-semibold shadow-md transition-all"
                >
                  Apply Filters
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* CARDS GRID */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading guidelines...</p>
        </div>
      ) : guidelines.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-xl">No guidelines found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {guidelines.map((item) => (
            <div
              key={item.guideline_number}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              onClick={() => router.push(`/guideline/details/${item.guideline_number}`)}
            >
              {/* THUMBNAIL */}
              <div className="relative h-48 bg-linear-to-br from-teal-400 to-emerald-500 overflow-hidden">
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                
                {/* STATUS BADGE */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                      item.status === "active"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {item.status === "active" ? "PUBLISHED" : "UNPUBLISHED"}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                
                {/* CATEGORY */}
                <div className="mb-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-semibold">
                    {item.category.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {item.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* FOOTER */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  
                  {/* DATE */}
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Calendar size={14} />
                    <span>{formatDate(item.created_at)}</span>
                  </div>

                  {/* VIEW BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/guideline/details/${item.guideline_number}`);
                    }}
                    className="flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-200 transition-all font-semibold text-sm"
                  >
                    <Eye size={16} />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center">
        
        <span className="text-gray-600 font-medium">
          Showing <span className="font-bold text-teal-600">{guidelines.length}</span> of <span className="font-bold">{totalPage * limit}</span> results
        </span>

        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-3 border-2 border-gray-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-50 hover:border-teal-500 transition-all"
          >
            <ChevronLeft />
          </button>

          <span className="px-6 py-3 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold shadow-md">
            Page {page} of {totalPage}
          </span>

          <button
            disabled={page === totalPage}
            onClick={() => setPage((p) => p + 1)}
            className="p-3 border-2 border-gray-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-50 hover:border-teal-500 transition-all"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

    </div>
  );
}