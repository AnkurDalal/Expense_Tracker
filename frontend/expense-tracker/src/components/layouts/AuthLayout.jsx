
import React from "react";
import { LuTrendingUpDown, LuWallet, LuCreditCard } from "react-icons/lu";
import { useTheme } from "../../context/ThemeContext";

export const AuthLayout = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>

      {/* Left Section */}
      <div className="w-full md:w-[60vw] px-8 sm:px-12 pt-8 pb-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <LuWallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Expense Tracker
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Smart financial management made simple</p>
            </div>
          </div>
          {children}
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:block relative w-[40vw] overflow-hidden">
        {/* Background gradient based on theme */}
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-violet-900/50 via-purple-900/50 to-pink-900/50' : 'bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50'}`}></div>
        
        {/* Decorative shapes */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-20 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-transparent rounded-3xl border border-purple-200/50"></div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-br from-pink-400/20 to-transparent rounded-full blur-3xl"></div>

        {/* Stats Cards Grid */}
        <div className="relative z-20 p-10 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <StatsInfoCard
              icon={<LuWallet className="w-6 h-6" />}
              label="Total Balance"
              value="430,000"
              color="from-primary to-purple-600"
              trend="+12.5%"
              isDarkMode={isDarkMode}
            />
            <StatsInfoCard
              icon={<LuCreditCard className="w-6 h-6" />}
              label="Monthly Expenses"
              value="12,500"
              color="from-red-500 to-pink-500"
              trend="-3.2%"
              isDarkMode={isDarkMode}
            />
            <StatsInfoCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              label="Savings Rate"
              value="24%"
              color="from-green-500 to-emerald-500"
              trend="+2.1%"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-20 w-5 h-5 bg-pink-400/20 rounded-full animate-bounce-slow" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

const StatsInfoCard = ({ icon, label, value, color, trend, isDarkMode }) => {
  return (
    <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl ${isDarkMode ? 'shadow-gray-900/50 border-gray-700/50 hover:shadow-gray-800/30' : 'shadow-gray-200/50 border-gray-200/50 hover:shadow-gray-300/30'} border transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg shadow-black/10`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
            {trend}
          </span>
        </div>
      </div>
      <div>
        <h6 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{label}</h6>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">₹{value}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">INR</span>
        </div>
      </div>
    </div>
  );
};

