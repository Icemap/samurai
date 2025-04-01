'use client';

import { motion } from 'framer-motion';

const AppleCard = ({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  variants,
  ...props 
}) => {
  return (
    <motion.div
      className={`bg-white dark:bg-apple-gray-800 rounded-2xl shadow-sm border border-apple-gray-200 dark:border-apple-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}
      variants={variants}
      {...props}
    >
      {(title || subtitle) && (
        <div className="px-6 py-5 border-b border-apple-gray-200 dark:border-apple-gray-700">
          {title && (
            <h2 className="text-lg font-semibold text-apple-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-apple-gray-500 dark:text-apple-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="px-6 py-6">
        {children}
      </div>
    </motion.div>
  );
};

export default AppleCard; 