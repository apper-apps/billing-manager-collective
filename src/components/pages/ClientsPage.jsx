import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/molecules/PageHeader";
import SearchBar from "@/components/molecules/SearchBar";
import ClientList from "@/components/organisms/ClientList";
import ClientForm from "@/components/organisms/ClientForm";
import Modal from "@/components/atoms/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { clientService } from "@/services/api/clientService";
import { toast } from "react-toastify";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm]);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      setError("Failed to load clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = [...clients];

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClients(filtered);
  };

  const handleCreateClient = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleSubmitClient = async (formData) => {
    try {
      if (editingClient) {
        await clientService.update(editingClient.Id, formData);
        toast.success("Client updated successfully!");
      } else {
        await clientService.create(formData);
        toast.success("Client added successfully!");
      }
      
      setShowModal(false);
      setEditingClient(null);
      loadClients();
    } catch (error) {
      toast.error("Failed to save client. Please try again.");
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      await clientService.delete(clientId);
      loadClients();
    } catch (error) {
      toast.error("Failed to delete client. Please try again.");
    }
  };

  if (loading) return <Loading type="cards" />;

  if (error) {
    return <Error message={error} onRetry={loadClients} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <PageHeader
        title="Clients"
        description="Manage your client information and contacts"
        actionLabel="Add Client"
        onAction={handleCreateClient}
        icon="Plus"
      />

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          placeholder="Search clients by name, company, or email..."
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
              <p className="text-sm text-slate-600">Total Clients</p>
              <p className="text-2xl font-bold text-slate-900">{clients.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
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
              <p className="text-sm text-slate-600">Active This Month</p>
              <p className="text-2xl font-bold text-slate-900">{Math.floor(clients.length * 0.8)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
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
              <p className="text-sm text-slate-600">New This Week</p>
              <p className="text-2xl font-bold text-slate-900">{Math.floor(clients.length * 0.1)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserPlus" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Client List */}
      {filteredClients.length === 0 ? (
        <Empty
          title="No clients found"
          description="Add your first client to start managing your business relationships."
          actionLabel="Add Client"
          onAction={handleCreateClient}
          icon="Users"
        />
      ) : (
        <ClientList
          clients={filteredClients}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />
      )}

      {/* Client Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingClient(null);
        }}
        title={editingClient ? "Edit Client" : "Add New Client"}
        size="lg"
      >
        <ClientForm
          client={editingClient}
          onSubmit={handleSubmitClient}
          onCancel={() => {
            setShowModal(false);
            setEditingClient(null);
          }}
        />
      </Modal>
    </motion.div>
  );
};

export default ClientsPage;