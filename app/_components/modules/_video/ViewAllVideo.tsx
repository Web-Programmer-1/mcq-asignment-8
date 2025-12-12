





"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Loader2,
  AlertCircle,
  ChevronDown,
  Eye,
  EyeOff,
  Video,
} from "lucide-react";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function ViewAllYouTubeVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination + Limit Filter
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Search Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Collapse Filter Panel
  const [showFilter, setShowFilter] = useState(false);

  // Fetch Videos from API
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(searchTerm && { searchTerm }),
      });
      
      const base_url = process.env.NEXT_PUBLIC_BASE_URL || "";
      const res = await fetch(
        `${base_url}/youtube?${params}`,
      );

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch videos");
      }

      setVideos(data.data.data);
      setTotalPages(data.data.meta.totalPage);
      setTotal(data.data.meta.total);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page, limit, searchTerm]);

  // Search Handler
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  // Loading Screen
  if (loading && videos.length === 0)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading videos...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r mt-20 from-teal-600 via-emerald-600 to-cyan-600 p-6 sm:p-8 rounded-2xl text-white mb-6 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Video className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">YouTube Video Library</h1>
              <p className="opacity-90 text-sm sm:text-base">Manage and organize your video content</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm opacity-80">Total Videos</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
        </div>

        {/* COLLAPSIBLE FILTER PANEL */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden border border-gray-100">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="w-full flex justify-between items-center p-5 text-left font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-teal-600" />
              <span className="text-lg">Show Filters</span>
            </div>
            <ChevronDown
              className={`transition-transform duration-300 text-teal-600 ${
                showFilter ? "rotate-180" : ""
              }`}
            />
          </button>

          {showFilter && (
            <div className="p-5 border-t bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Page Selector */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Page Number</label>
                  <input
                    type="number"
                    min={1}
                    value={page}
                    onChange={(e) => setPage(Number(e.target.value))}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Limit Selector */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Items Per Page</label>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-teal-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Search Input */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Search Videos</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Enter title or keywords..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                      onClick={handleSearch}
                      className="px-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl mb-6 flex gap-3 items-center shadow-sm">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {/* CARDS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                <div className="bg-gray-200 aspect-video" />
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-4" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {videos.map((v: any) => (
              <div
                key={v._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden bg-gray-100 aspect-video">
                  <img
                    src={v.thumbnail_url}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Play Button Overlay */}
                  <button
                    onClick={() => window.open(v.video_url, "_blank")}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="bg-teal-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 fill-current" />
                    </div>
                  </button>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-sm ${
                      v.is_published 
                        ? "bg-green-500/90 text-white" 
                        : "bg-gray-800/90 text-white"
                    }`}>
                      {v.is_published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Unpublished
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                    {v.title}
                  </h3>

                 
                  <div
                    className="text-gray-600 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: v.description }}
                  />

                  {/* Action Button */}
                  <button
                    onClick={() => window.open(v.video_url, "_blank")}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                  >
                    <Play className="w-5 h-5" />
                    Watch Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {videos.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Video className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Videos Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* PAGINATION */}
        {videos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-100">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-medium">
                Page <span className="text-teal-600 font-bold text-lg">{page}</span> of <span className="font-bold">{totalPages}</span>
              </span>
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}