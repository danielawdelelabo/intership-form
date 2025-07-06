"use client";

import { useState } from "react";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Menu,
} from "lucide-react";
import { GetAllComponent } from "../dashbaordComponents/getAll";
import { SideBar } from "../dashbaordComponents/sideBar";

// Overview Component
const OverviewComponent = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome to Dashboard</h2>
        <p className="text-blue-100">
          Manage your internship applications efficiently
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {" "}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Total Applications
              </h3>
              <p className="text-3xl font-bold text-blue-600">-</p>
              <p className="text-sm text-gray-500">All submissions</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Approved</h3>
              <p className="text-3xl font-bold text-green-600">-</p>
              <p className="text-sm text-gray-500">Accepted applications</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">-</p>
              <p className="text-sm text-gray-500">Under review</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const Page = () => {
  const [currentView, setCurrentView] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getPageTitle = () => {
    switch (currentView) {
      case "overview":
        return "Dashboard Overview";
      case "applications":
        return "Internship Applications";
      default:
        return "Dashboard";
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <OverviewComponent />;
      case "applications":
        return <GetAllComponent />;
      default:
        return <OverviewComponent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static lg:translate-x-0 transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:flex-shrink-0`}
      >
        <SideBar
          onNavigate={(view) => {
            setCurrentView(view);
            setIsSidebarOpen(false);
          }}
          currentView={currentView}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {" "}
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-xs lg:text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>


        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Page;
