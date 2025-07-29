import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";

const ClientList = ({ clients, onEdit, onDelete }) => {
  const handleDelete = (client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      onDelete(client.Id);
      toast.success("Client deleted successfully");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client, index) => (
        <motion.div
          key={client.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-200 p-6 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{client.name}</h3>
                  <p className="text-sm text-slate-600">{client.company}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ApperIcon name="Mail" className="w-4 h-4" />
                  <span>{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ApperIcon name="Phone" className="w-4 h-4" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ApperIcon name="MapPin" className="w-4 h-4" />
                    <span className="line-clamp-2">{client.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(client)}
              className="hover:bg-primary-50 hover:text-primary-700"
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(client)}
              className="hover:bg-red-50 hover:text-red-700"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ClientList;