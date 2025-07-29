import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const PageHeader = ({ title, description, actionLabel, onAction, icon }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-slate-600">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-gradient-to-r from-primary-600 to-primary-700 shrink-0">
          {icon && <ApperIcon name={icon} className="w-4 h-4 mr-2" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;