


"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  BarChart3,
  User,
  LogOut,
  FileSliders,
  Home,
  BookOpen,
  PlayCircle,
  HelpCircle,
  UserCircle,
  Video,
  BookAIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import { FcAbout } from "react-icons/fc";
import { PiAddressBookTabs, PiExamBold } from "react-icons/pi";
import { RiGuideLine } from "react-icons/ri";
import { MdCloudQueue } from "react-icons/md";

interface UserData {
  id: string;
  name: string;
  email?: string;
  phone_number: string;
  image?: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;

  return null;
}

const Backend_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: PiAddressBookTabs },
    { name: "Book", href: "/book", icon: BookAIcon },
    { name: "Exam", href: "/exam", icon: PiExamBold },
    { name: "Guideline", href: "/guideline", icon: RiGuideLine },
    { name: "Video", href: "/video", icon: Video },
   

  ];


  

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Do you really want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Logging out...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const accessToken = getCookie("access_token");

      if (accessToken) {
        await fetch(`${Backend_BASE_URL}/user/logout`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
        });
      }

      // Delete cookie
      document.cookie = "access_token=; Max-Age=0; path=/;";

      Swal.fire({
        icon: "success",
        title: "Logged out successfully!",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/login";
      });
    } catch (error) {
      console.error("Error during logout:", error);

      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  // Fetch user info
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = getCookie("access_token");

        if (!accessToken) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${Backend_BASE_URL}/user/auth`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
        });

        const data = await response.json();

        if (response.ok && data.success && data.data) {
          setUser(data.data);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuOpen
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // User initials
  const getUserInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full top-0 z-50 border-b">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-36">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="bg-green-700 p-2 rounded-lg group-hover:bg-green-800 transition-all">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-green-800">
                MCQ Analysis BD
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">
                Smart Learning Platform
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}

            {/* AUTH SECTION - DESKTOP */}
            {loading ? (
              <div className="ml-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="hidden lg:flex items-center space-x-2">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ) : user ? (
              <div className="ml-4 flex items-center space-x-4 border-l pl-4">
               
               <Link href={"/profile"}>
               
                      <div className="flex items-center space-x-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-green-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-700 to-green-600 flex items-center justify-center text-white font-semibold shadow-sm">
                      {getUserInitials(user.name)}
                    </div>
                  )}
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate max-w-[150px]">
                      {user.email || user.phone_number}
                    </p>
                  </div>
                </div>
               </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden lg:inline font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="ml-4 flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-green-700 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-800 hover:to-green-700 transition-all transform hover:scale-[1.02] shadow-sm hover:shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center space-x-3">
            {!loading && user && (
              <div className="flex items-center space-x-2">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-green-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-700 to-green-600 flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials(user.name)}
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t animate-in slide-in-from-top-5 duration-200"
          >
            <div className="px-4 py-3 space-y-1">
              {/* Navigation Links */}
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-green-700 hover:bg-green-50 px-4 py-3 rounded-lg transition-all"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}

              {/* User Section */}
              {!loading && user && (
                <>
                  {/* User Info */}
                  <div className="px-4 py-3 border-t mt-2">
                    <div className="flex items-center space-x-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-green-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-700 to-green-600 flex items-center justify-center text-white font-semibold text-lg">
                          {getUserInitials(user.name)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">
                          {user.email || user.phone_number}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User Menu Links */}
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-green-700 hover:bg-green-50 px-4 py-3 rounded-lg transition-all"
                  >
                    <User className="h-5 w-5" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/test"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-green-700 hover:bg-green-50 px-4 py-3 rounded-lg transition-all"
                  >
                    <FileSliders className="h-5 w-5" />
                    <span>My Test</span>
                  </Link>
                  <Link
                    href="/video"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-green-700 hover:bg-green-50 px-4 py-3 rounded-lg transition-all"
                  >
                    <PlayCircle className="h-5 w-5" />
                    <span>My Video</span>
                  </Link>
                  <Link
                    href="/guideline"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-green-700 hover:bg-green-50 px-4 py-3 rounded-lg transition-all"
                  >
                    <FileSliders className="h-5 w-5" />
                    <span>Guideline Hub</span>
                  </Link>
                  <Link
                    href="/exam"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-green-700 hover:bg-green-50 px-4 py-3 rounded-lg transition-all"
                  >
                    <FileSliders className="h-5 w-5" />
                    <span>Exam Hub</span>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg transition-all mt-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              )}

              {/* Auth Buttons for non-logged users */}
              {!loading && !user && (
                <div className="border-t pt-3 mt-2 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center text-gray-700 hover:text-green-700 hover:bg-green-50 px-4 py-3 rounded-lg font-medium transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center bg-gradient-to-r from-green-700 to-green-600 text-white px-4 py-3 rounded-lg hover:from-green-800 hover:to-green-700 transition-all font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}