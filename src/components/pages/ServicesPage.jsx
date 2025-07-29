import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/molecules/PageHeader";
import SearchBar from "@/components/molecules/SearchBar";
import ServiceList from "@/components/organisms/ServiceList";
import ServiceForm from "@/components/organisms/ServiceForm";
import Modal from "@/components/atoms/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { serviceService } from "@/services/api/serviceService";
import { toast } from "react-toastify";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await serviceService.getAll();
      setServices(data);
    } catch (err) {
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const handleCreateService = () => {
    setEditingService(null);
    setShowModal(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleSubmitService = async (formData) => {
    try {
      if (editingService) {
        await serviceService.update(editingService.Id, formData);
        toast.success("Service updated successfully!");
      } else {
        await serviceService.create(formData);
        toast.success("Service added successfully!");
      }
      
      setShowModal(false);
      setEditingService(null);
      loadServices();
    } catch (error) {
      toast.error("Failed to save service. Please try again.");
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await serviceService.delete(serviceId);
      loadServices();
    } catch (error) {
      toast.error("Failed to delete service. Please try again.");
    }
  };

  const totalValue = services.reduce((sum, service) => sum + service.price, 0);
  const averagePrice = services.length > 0 ? totalValue / services.length : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  if (loading) return <Loading />;

  if (error) {
    return <Error message={error} onRetry={loadServices} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <PageHeader
        title="Services"
        description="Manage your service catalog and pricing"
        actionLabel="Add Service"
        onAction={handleCreateService}
        icon="Plus"
      />

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          placeholder="Search services by name or description..."
          onSearch={setSearchTerm}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Services</p>
              <p className="text-2xl font-bold text-slate-900">{services.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 shadow-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Average Price</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(averagePrice)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 shadow-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Value</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Service List */}
      {filteredServices.length === 0 ? (
        <Empty
          title="No services found"
          description="Add your first service to start building your service catalog."
          actionLabel="Add Service"
          onAction={handleCreateService}
          icon="Package"
        />
      ) : (
        <ServiceList
          services={filteredServices}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
        />
      )}

      {/* Service Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingService(null);
        }}
        title={editingService ? "Edit Service" : "Add New Service"}
        size="lg"
      >
        <ServiceForm
          service={editingService}
          onSubmit={handleSubmitService}
          onCancel={() => {
            setShowModal(false);
            setEditingService(null);
          }}
        />
      </Modal>
    </motion.div>
  );
};

export default ServicesPage;