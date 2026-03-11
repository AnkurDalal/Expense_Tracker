import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, placeholder, label, type, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className={`w-full bg-white border-2 transition-all duration-200 focus:outline-none pr-12 ${
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
              : isFocused 
                ? "border-primary focus:border-primary focus:ring-primary/20" 
                : "border-gray-200 focus:border-primary focus:ring-primary/20"
          }`}
          value={value}
          onChange={(e) => onChange(e)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
            onClick={toggleShowPassword}
            tabIndex={-1}
          >
            {showPassword ? (
              <FaRegEye size={20} />
            ) : (
              <FaRegEyeSlash size={20} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm flex items-center gap-1">
          <span className="text-red-500">•</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
