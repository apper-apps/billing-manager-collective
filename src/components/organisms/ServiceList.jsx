import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";

const ServiceList = ({ services, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const handleDelete = (service) => {
    if (window.confirm(`Are you sure you want to delete ${service.name}?`)) {
      onDelete(service.Id);
      toast.success("Service deleted successfully");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
      <div className="divide-y divide-slate-100">
        {services.map((service, index) => (
          <motion.div
            key={service.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-6 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Package" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{service.name}</h3>
                    <p className="text-sm text-slate-600">{service.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-600 ml-13">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="DollarSign" className="w-4 h-4" />
                    <span className="font-semibold text-primary-700">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  {service.unit && (
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Package" className="w-4 h-4" />
                      <span>per {service.unit}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(service)}
                  className="hover:bg-primary-50 hover:text-primary-700"
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(service)}
                  className="hover:bg-red-50 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;