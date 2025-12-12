"use client";
import React, { useState } from 'react';
import { Menu, X, BarChart3, Clock, Target, TrendingUp, ChevronRight, CheckCircle2, Brain, Award, Users } from 'lucide-react';


export default function MCQAnalysisBD() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50">

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fadeIn">
              <div className="inline-block">
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                 Smart MCQ Analysis Platform
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Analyze. <span className="text-green-800">Improve.</span> Succeed.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform your MCQ preparation with AI-powered insights. Identify weak areas, track progress, and achieve your academic goals with data-driven strategies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-green-800 text-white px-8 py-4 rounded-xl hover:bg-green-900 transition transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 group">
                  <span className="text-lg font-semibold">Start Analyzing</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition" />
                </button>
                <button className="bg-white text-green-800 px-8 py-4 rounded-xl hover:bg-gray-50 transition border-2 border-green-800 flex items-center justify-center space-x-2">
                  <span className="text-lg font-semibold">View Demo</span>
                </button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-800" />
                  <span className="text-gray-700 font-medium">10,000+ Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-800" />
                  <span className="text-gray-700 font-medium">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-linear-to-br from-green-800 to-emerald-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition duration-500">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Recent Analysis</h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">95%</span>
                  </div>
                  <div className="space-y-3">
                    {['Physics', 'Chemistry', 'Mathematics'].map((subject, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                          <div 
                            className="bg-green-800 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${90 - idx * 10}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{90 - idx * 10}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-yellow-400 rounded-2xl p-4 shadow-xl transform rotate-6 hover:rotate-0 transition">
                <TrendingUp className="h-8 w-8 text-yellow-900" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, Fast, and Effective</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: 'Upload Your MCQs', desc: 'Simply upload your answer sheet or enter your responses', step: '01' },
              { icon: Brain, title: 'Get Detailed Insights', desc: 'Our AI analyzes patterns and identifies improvement areas', step: '02' },
              { icon: TrendingUp, title: 'Improve Performance', desc: 'Follow personalized recommendations and track progress', step: '03' }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-8 hover:shadow-2xl transition duration-500 border-2 border-transparent hover:border-green-800">
                  <div className="absolute -top-4 -left-4 bg-green-800 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                  <item.icon className="h-16 w-16 text-green-800 mb-6 transform group-hover:scale-110 transition" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 bg-linear-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to excel in MCQ exams</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, title: 'Subject-wise Analysis', desc: 'Deep dive into each subject\'s performance' },
              { icon: Clock, title: 'Time Management', desc: 'Optimize your exam time allocation' },
              { icon: Target, title: 'Weak Topic Detection', desc: 'Pinpoint areas needing attention' },
              { icon: TrendingUp, title: 'Progress Tracking', desc: 'Monitor improvement over time' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-green-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section id="why-us" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">Why It Matters</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Success in competitive exams isn't just about hard work—it's about smart work. Our platform helps you:
              </p>
              <div className="space-y-4">
                {[
                  'Save 50% study time with targeted practice',
                  'Increase scores by identifying weak areas',
                  'Build confidence with data-driven insights',
                  'Stay motivated with progress visualization'
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-800 shrink-0 mt-1" />
                    <p className="text-lg text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
              <button className="bg-green-800 text-white px-8 py-4 rounded-xl hover:bg-green-900 transition transform hover:scale-105 shadow-lg mt-6">
                Start Your Journey Today
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { number: '10K+', label: 'Active Students' },
                { number: '95%', label: 'Success Rate' },
                { number: '50K+', label: 'MCQs Analyzed' },
                { number: '4.9/5', label: 'User Rating' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-linear-to-br from-green-800 to-emerald-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition shadow-xl">
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-green-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}




