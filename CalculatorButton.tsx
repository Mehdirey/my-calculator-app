
import React from 'react';

type ButtonVariant = 'number' | 'operator' | 'special';

interface CalculatorButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ onClick, children, className = '', variant = 'number' }) => {
  const baseClasses = "flex items-center justify-center text-3xl sm:text-4xl font-medium rounded-full aspect-square transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400";
  
  const variantClasses = {
    number: 'bg-zinc-200 text-black active:bg-zinc-300',
    operator: 'bg-orange-500 text-white active:bg-orange-400',
    special: 'bg-gray-300 text-black active:bg-gray-400',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  // For zero button, we adjust aspect ratio
  if (className.includes('col-span-2')) {
    return (
         <button onClick={onClick} className={combinedClasses.replace('aspect-square', '')}>
             {children}
         </button>
    )
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
};

export default CalculatorButton;