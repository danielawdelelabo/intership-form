"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";

interface SubmissionData {
  email: string;
  fullName: string;
  dateOfBirth: string;
  residenceAddress: string;
  dateOfAgreement: string;
  submissionTimestamp: number;
}

const SuccessPage = () => {
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);

  useEffect(() => {
    // Get submission data from localStorage
    const savedSubmission = localStorage.getItem("internshipSubmission");
    if (savedSubmission) {
      try {
        const data = JSON.parse(savedSubmission);
        setSubmissionData(data);
      } catch (error) {
        console.error("Error parsing submission data:", error);
      }
    }
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Main Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your interest in our internship program. Your application has been received and is being reviewed.
          </p>

          {/* Submission Details */}
          {submissionData && (
            <div className="bg-white p-6 rounded-lg shadow-md text-left mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Submission Details
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-800">{submissionData.fullName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-800">{submissionData.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Submitted on:</span>
                  <span className="ml-2 text-gray-800">
                    {format(new Date(submissionData.submissionTimestamp), "PPP 'at' p")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3 text-sm text-blue-700">
                <p className="font-medium">What happens next?</p>
                <ul className="text-center mt-2 list-disc list-inside space-y-1">
                  <li>Our team will review your application</li>
                  <li>We&apos;ll contact you within 5-7 business days</li>
                  <li>If selected, we&apos;ll schedule an interview</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Warning about duplicate submissions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-medium">
                  You have already submitted your application
                </p>
                <p className="text-sm text-yellow-600 mt-1">
                  Multiple submissions with the same email are not allowed.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
