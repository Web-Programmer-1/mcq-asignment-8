"use client";
import React from 'react';
import { BarChart3, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-white overflow-hidden">

      <div className="absolute inset-0 bg-linear-to-br from-emerald-50 via-white to-green-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative">
    
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white">Stay Updated</h3>
                </div>
                <p className="text-emerald-50 text-sm md:text-base">Get latest study tips and AI-powered insights directly to your inbox</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-6 py-3 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-emerald-300 w-full sm:w-80"
                />
                <button className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl whitespace-nowrap">
                  Subscribe <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-emerald-600 to-green-600 p-2.5 rounded-xl shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">MCQ Analysis BD</span>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                Transform your MCQ preparation with AI-powered insights and achieve your academic goals with data-driven strategies.
              </p>
              <div className="flex space-x-3 pt-2">
                <a href="#" className="bg-emerald-100 hover:bg-emerald-600 text-emerald-600 hover:text-white p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-emerald-100 hover:bg-emerald-600 text-emerald-600 hover:text-white p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="bg-emerald-100 hover:bg-emerald-600 text-emerald-600 hover:text-white p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="bg-emerald-100 hover:bg-emerald-600 text-emerald-600 hover:text-white p-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-6 flex items-center gap-2">
                Quick Links
                <div className="h-0.5 w-8 bg-gradient-to-r from-emerald-600 to-transparent"></div>
              </h3>
              <ul className="space-y-3">
                {['Features', 'How It Works', 'Why Choose Us', 'Pricing', 'Success Stories'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 text-sm flex items-center gap-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-6 flex items-center gap-2">
                Resources
                <div className="h-0.5 w-8 bg-gradient-to-r from-emerald-600 to-transparent"></div>
              </h3>
              <ul className="space-y-3">
                {['Blog', 'Study Tips', 'FAQ', 'Support Center', 'Documentation'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 text-sm flex items-center gap-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-6 flex items-center gap-2">
                Contact Us
                <div className="h-0.5 w-8 bg-gradient-to-r from-emerald-600 to-transparent"></div>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-600 transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-sm text-gray-600 pt-1">
                    Bogra, Rajshahi Division<br />Bangladesh
                  </span>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-600 transition-colors duration-300">
                    <Mail className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <a href="mailto:info@mcqanalysisbd.com" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300">
                    info@mcqanalysisbd.com
                  </a>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-600 transition-colors duration-300">
                    <Phone className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <a href="tel:+8801234567890" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300">
                    +880 123 456 7890
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600 text-center md:text-left">
                © 2024 MCQ Analysis BD. All rights reserved. Made with mdhakimshorkar123@gmail.com
              </p>
              <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
                <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 font-medium">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}