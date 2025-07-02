"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // Check if user has already submitted
    const existingSubmission = localStorage.getItem("internshipSubmission");
    setHasSubmitted(!!existingSubmission);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(214,222,35,0.1),transparent_50%)] animate-pulse"></div>

      <div className="max-w-lg w-full space-y-12 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight animate-slide-up">
              <span className="bg-gradient-to-r from-[#D6DE23] to-[#a3a758] bg-clip-text text-transparent">
                LeLabo
              </span>
              <span className="block text-gray-800 mt-2">Digital</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#D6DE23] to-[#a3a758] mx-auto rounded-full animate-expand"></div>
          </div>

          <p className="text-xl md:text-2xl text-gray-600 font-light animate-fade-in-delay">
            Internship Opportunity
          </p>
        </div>

        <div className="space-y-8 animate-fade-in-delay-2">
          {hasSubmitted ? (
            <>
              <Link
                href="/success"
                className="group relative w-full flex justify-center py-4 px-8 border-2 border-green-500 rounded-2xl text-lg font-semibold text-white bg-green-500 hover:bg-transparent hover:text-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 active:scale-95"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>VIEW SUBMISSION STATUS</span>
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              </Link>

              <div className="text-center">
                <p className="text-sm text-green-600 font-medium">
                  ✓ Application already submitted
                </p>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/form"
                className="group relative w-full flex justify-center py-4 px-8 border-2 border-[#D6DE23] rounded-2xl text-lg font-semibold text-white bg-[#D6DE23] hover:bg-transparent hover:text-[#000] focus:outline-none focus:ring-4 focus:ring-[#D6DE23]/30 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl hover:shadow-[#D6DE23]/25 active:scale-95"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>ACCEPT APPLICATION</span>
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>

                {/* Gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D6DE23] to-[#a3a758] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>

              {/* Subtle call-to-action hint */}
              <div className="text-center animate-bounce-subtle">
                <p className="text-sm text-gray-500 font-medium">
                  Ready to start your journey?
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-8 animate-fade-in-delay-3">
          <p className="text-xs text-gray-400 font-medium">
            © 2025 LeLabo Digital SARL. All rights reserved.
          </p>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-[#D6DE23] rounded-full animate-float opacity-60"></div>
      <div className="absolute bottom-32 right-16 w-3 h-3 bg-[#a3a758] rounded-full animate-float-delay opacity-40"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-[#a3a758] rounded-full animate-float-delay opacity-40"></div>
      <div className="absolute top-1/2 right-8 w-5 h-5 bg-[#D6DE23] rounded-full animate-float-delay-2 opacity-50"></div>
      <div className="absolute top-1/2 left-8 w-5 h-5 bg-[#D6DE23] rounded-full animate-float-delay-2 opacity-50"></div>

      {/* Additional floating elements */}
      <div className="absolute top-32 right-20 w-2 h-2 bg-[#D6DE23] rounded-full animate-float opacity-70"></div>
      <div className="absolute top-40 left-1/4 w-6 h-6 bg-[#a3a758] rounded-full animate-float-delay opacity-30"></div>
      <div className="absolute bottom-20 left-1/3 w-3 h-3 bg-[#D6DE23] rounded-full animate-float-delay-2 opacity-60"></div>
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-[#a3a758] rounded-full animate-float opacity-45"></div>
      <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-[#D6DE23] rounded-full animate-float-delay opacity-80"></div>
      <div className="absolute top-16 left-1/2 w-3 h-3 bg-[#a3a758] rounded-full animate-float-delay-2 opacity-35"></div>
      <div className="absolute bottom-16 left-20 w-5 h-5 bg-[#D6DE23] rounded-full animate-float opacity-55"></div>
      <div className="absolute top-3/4 right-12 w-4 h-4 bg-[#a3a758] rounded-full animate-float-delay opacity-40"></div>
      <div className="absolute top-60 left-12 w-2 h-2 bg-[#D6DE23] rounded-full animate-float-delay-2 opacity-75"></div>
      <div className="absolute bottom-60 right-32 w-3 h-3 bg-[#a3a758] rounded-full animate-float opacity-50"></div>
      <div className="absolute top-2/3 left-1/4 w-4 h-4 bg-[#D6DE23] rounded-full animate-float-delay opacity-65"></div>
      <div className="absolute bottom-24 right-1/4 w-2 h-2 bg-[#a3a758] rounded-full animate-float-delay-2 opacity-45"></div>
    </div>
  );
}
