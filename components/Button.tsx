
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const primaryStyles = 'bg-primary-green text-white hover:bg-secondary-green focus:ring-primary-green';
  const secondaryStyles = 'bg-medium-gray text-dark-blue hover:bg-light-gray focus:ring-medium-gray';
  const disabledStyles = 'opacity-60 cursor-not-allowed';

  return (
    <button
      className={`${baseStyles} ${variant === 'primary' ? primaryStyles : secondaryStyles} ${
        props.disabled || isLoading ? disabledStyles : ''
      } ${className}`}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
