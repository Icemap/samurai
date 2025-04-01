'use client';

import React from 'react';

const AppleInput = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  error,
  icon,
  className = '',
  required = false,
  disabled = false,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-apple-gray-900 dark:text-apple-gray-100 mb-1.5"
        >
          {label}
          {required && <span className="text-apple-red ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-apple-gray-500 sm:text-sm">{icon}</span>
          </div>
        )}
        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            block w-full 
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            text-apple-gray-900 dark:text-white
            bg-white dark:bg-apple-gray-800
            border ${error ? 'border-apple-red' : 'border-apple-gray-300 dark:border-apple-gray-700'}
            rounded-apple shadow-sm
            focus:outline-none focus:ring-1 
            ${error ? 'focus:ring-apple-red focus:border-apple-red' : 'focus:ring-apple-blue dark:focus:ring-apple-blue-light focus:border-apple-blue dark:focus:border-apple-blue-light'}
            disabled:opacity-50 disabled:bg-apple-gray-100 dark:disabled:bg-apple-gray-900
            transition-all duration-200
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-apple-red">{error}</p>
      )}
    </div>
  );
};

export default AppleInput; 