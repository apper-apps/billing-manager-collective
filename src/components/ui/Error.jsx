import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="bg-white rounded-xl border border-red-200 shadow-card p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Error</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Error;