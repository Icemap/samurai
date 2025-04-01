'use client';

import { motion } from 'framer-motion';

const AppleButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  loading = false,
  ...props
}) => {
  // Variants
  const variants = {
    primary: 'bg-apple-blue dark:bg-apple-blue-light text-white hover:bg-apple-blue-dark dark:hover:bg-apple-blue',
    secondary: 'bg-apple-gray-200 dark:bg-apple-gray-700 text-apple-gray-900 dark:text-white hover:bg-apple-gray-300 dark:hover:bg-apple-gray-600',
    success: 'bg-apple-green text-white hover:bg-apple-green-dark',
    danger: 'bg-apple-red text-white hover:bg-apple-red-dark',
    ghost: 'bg-transparent text-apple-gray-900 dark:text-white hover:bg-apple-gray-200 dark:hover:bg-apple-gray-800 border border-apple-gray-300 dark:border-apple-gray-600',
    link: 'bg-transparent text-apple-blue dark:text-apple-blue-light hover:underline p-0 shadow-none font-medium'
  };

  // Sizes
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg'
  };

  // Determine loading state and icon position
  const showIcon = icon || loading;
  const iconLeft = iconPosition === 'left';
  
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        flex items-center justify-center
        font-medium
        rounded-apple
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-apple-blue dark:focus:ring-apple-blue-light
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variant === 'link' ? '' : 'shadow-sm'}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {showIcon && iconLeft && (
        <span className={`${iconLeft && children ? 'mr-2' : ''}`}>
          {loading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            icon
          )}
        </span>
      )}
      
      {children}
      
      {showIcon && !iconLeft && (
        <span className={`${!iconLeft && children ? 'ml-2' : ''}`}>
          {loading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            icon
          )}
        </span>
      )}
    </motion.button>
  );
};

export default AppleButton; 