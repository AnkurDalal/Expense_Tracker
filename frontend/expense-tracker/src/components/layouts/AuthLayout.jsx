
import React from "react";
import CARD_2 from "../../assets/images/card2.png";
import { LuTrendingUpDown } from "react-icons/lu";

export const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">

      {/* Left Section */}
      <div className="w-full md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">
          Expense Tracker
        </h2>
        {children}
      </div>

      {/* Right Section */}
      <div className="hidden md:block relative w-[40vw] bg-violet-50 overflow-hidden">

        <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5"></div>

        <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] right-10"></div>

        <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5"></div>

        <div className="relative z-20 p-10">
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income & Expenses"
            value="430,000"
            color="bg-purple-600"
          />
        </div>

        <img
          src={CARD_2}
          alt="card"
          className="w-64 lg:w-[80%] absolute bottom-10 right-10 shadow-lg shadow-blue-400/15"
        />
      </div>
    </div>
  );
};

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50">
      <div
        className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-xs text-gray-500 mb-1">{label}</h6>
        <span className="text-[20px] font-semibold">${value}</span>
      </div>
    </div>
  );
};

