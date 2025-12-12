"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Tag,
  Calendar,
  CheckCircle,
  XCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";
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

const formatTime = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function ViewGuideline() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // FETCH SINGLE GUIDELINE
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;
  const fetchData = async () => {
    try {
      const res = await fetch(`${base_url}/guideline/${id}`, {
        headers: {
          Authorization: getCookie("access_token") || "",
        },
      });

      const json = await res.json();

      if (res.ok) {
        setData(json.data);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading guideline...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl shadow-2xl">
          <XCircle size={64} className="mx-auto text-red-500 mb-4" />
          <p className="text-xl text-red-600 font-bold">Guideline not found!</p>
          <button
            onClick={() => router.back()}
            className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-teal-700 font-semibold mb-6 hover:text-teal-900 transition-colors bg-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg"
      >
        <ArrowLeft size={20} />
        Back to Guidelines
      </button>

      {/* MAIN CONTENT CARD */}
      <div className="max-w-5xl mx-auto">

        {/* HEADER SECTION */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 p-8 rounded-3xl shadow-2xl text-white mb-8 relative overflow-hidden">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles size={32} />
              <span className="text-teal-100 text-sm font-semibold">Guideline #{data.guideline_number}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
            
            {/* Status & Category Badges */}
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold text-sm flex items-center gap-2">
                <Tag size={16} />
                {data.category.replace(/_/g, " ").toUpperCase()}
              </span>
              
              <span
                className={`px-4 py-2 rounded-full backdrop-blur-sm font-semibold text-sm flex items-center gap-2 ${
                  data.status === "active"
                    ? "bg-green-500/30 text-white"
                    : "bg-yellow-500/30 text-white"
                }`}
              >
                {data.status === "active" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {data.status === "active" ? "PUBLISHED" : "UNPUBLISHED"}
              </span>

              {data.created_at && (
                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold text-sm flex items-center gap-2">
                  <Calendar size={16} />
                  {formatDate(data.created_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* THUMBNAIL SECTION */}
          <div className="relative h-96 bg-gradient-to-br from-teal-400 to-emerald-500 overflow-hidden">
            <img
              src={data.thumbnail_url}
              alt={data.title}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* DESCRIPTION SECTION */}
          <div className="p-8">
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-teal-100 rounded-xl">
                <FileText className="text-teal-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Description</h2>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-teal-600">
              <p className="text-gray-700 leading-relaxed text-lg">
                {data.description}
              </p>
            </div>

          </div>

          {/* METADATA GRID */}
          {(data.created_at || data.updated_at) && (
            <div className="px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {data.created_at && (
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-5 rounded-2xl border border-teal-200">
                    <div className="flex items-center gap-2 text-teal-700 font-semibold mb-2">
                      <Calendar size={18} />
                      Created Date
                    </div>
                    <p className="text-gray-800 font-bold text-lg">
                      {formatDate(data.created_at)} at {formatTime(data.created_at)}
                    </p>
                  </div>
                )}

                {data.updated_at && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                      <Calendar size={18} />
                      Last Updated
                    </div>
                    <p className="text-gray-800 font-bold text-lg">
                      {formatDate(data.updated_at)} at {formatTime(data.updated_at)}
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* INFO BANNER */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <BookOpen size={24} />
            <div>
              <p className="font-bold text-lg">Guideline Information</p>
              <p className="text-blue-100 text-sm">This guideline is part of our comprehensive learning system</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}