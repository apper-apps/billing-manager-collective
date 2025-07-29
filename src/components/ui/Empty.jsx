import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  actionLabel = "Add Item",
  onAction,
  icon = "Package"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">{description}</p>
        {onAction && (
          <Button onClick={onAction} className="bg-gradient-to-r from-primary-600 to-primary-700">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;