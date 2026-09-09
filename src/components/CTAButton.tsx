import Link from 'next/link';
import { ReactNode } from 'react';

interface CTAButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function CTAButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
}: CTAButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
    secondary: 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 shadow-sm',
    outline: 'border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs sm:text-sm',
    lg: 'px-6 py-3 text-sm sm:text-base',
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {children}
    </button>
  );
}
