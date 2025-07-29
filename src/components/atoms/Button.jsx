import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl focus:ring-primary-500 transform hover:scale-105",
    secondary: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-primary-500 shadow-sm hover:shadow-md",
    outline: "border border-primary-300 text-primary-700 hover:bg-primary-50 hover:border-primary-400 focus:ring-primary-500",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl focus:ring-red-500 transform hover:scale-105",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-primary-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;