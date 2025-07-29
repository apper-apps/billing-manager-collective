import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    draft: "bg-slate-100 text-slate-700 border-slate-200",
    sent: "bg-blue-100 text-blue-700 border-blue-200",
    paid: "bg-green-100 text-green-700 border-green-200",
    overdue: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;