import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl", 
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-h-[90vh] overflow-hidden",
              sizes[size]
            )}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;