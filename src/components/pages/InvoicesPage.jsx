import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/molecules/PageHeader";
import SearchBar from "@/components/molecules/SearchBar";
import InvoiceTable from "@/components/organisms/InvoiceTable";
import InvoiceForm from "@/components/organisms/InvoiceForm";
import Modal from "@/components/atoms/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { invoiceService } from "@/services/api/invoiceService";
import { clientService } from "@/services/api/clientService";
import { toast } from "react-toastify";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchTerm, statusFilter]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError("");
      const [invoicesData, clientsData] = await Promise.all([
        invoiceService.getAll(),
        clientService.getAll()
      ]);
      
      // Enrich invoices with client names
      const enrichedInvoices = invoicesData.map(invoice => {
        const client = clientsData.find(c => c.Id === invoice.clientId);
        return {
          ...invoice,
          clientName: client ? `${client.name} (${client.company})` : "Unknown Client"
        };
      });
      
      setInvoices(enrichedInvoices);
    } catch (err) {
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    let filtered = [...invoices];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    setFilteredInvoices(filtered);
  };

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowModal(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowModal(true);
  };

  const handleSubmitInvoice = async (formData) => {
    try {
      if (editingInvoice) {
        await invoiceService.update(editingInvoice.Id, formData);
        toast.success("Invoice updated successfully!");
      } else {
        await invoiceService.create(formData);
        toast.success("Invoice created successfully!");
      }
      
      setShowModal(false);
      setEditingInvoice(null);
      loadInvoices();
    } catch (error) {
      toast.error("Failed to save invoice. Please try again.");
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      await invoiceService.delete(invoiceId);
      loadInvoices();
    } catch (error) {
      toast.error("Failed to delete invoice. Please try again.");
    }
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" }
  ];

  if (loading) return <Loading type="table" />;

  if (error) {
    return <Error message={error} onRetry={loadInvoices} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <PageHeader
        title="Invoices"
        description="Manage and track all your invoices"
        actionLabel="Add Invoice"
        onAction={handleCreateInvoice}
        icon="Plus"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search invoices by number or client..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Invoices", value: invoices.length, icon: "FileText", color: "primary" },
          { label: "Draft", value: invoices.filter(i => i.status === "draft").length, icon: "Edit", color: "slate" },
          { label: "Sent", value: invoices.filter(i => i.status === "sent").length, icon: "Send", color: "blue" },
          { label: "Paid", value: invoices.filter(i => i.status === "paid").length, icon: "CheckCircle", color: "green" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-slate-200 shadow-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-600 to-${stat.color}-700 rounded-lg flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Invoice Table */}
      {filteredInvoices.length === 0 ? (
        <Empty
          title="No invoices found"
          description="Create your first invoice to get started with billing management."
          actionLabel="Create Invoice"
          onAction={handleCreateInvoice}
          icon="FileText"
        />
      ) : (
        <InvoiceTable
          invoices={filteredInvoices}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
        />
      )}

      {/* Invoice Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingInvoice(null);
        }}
        title={editingInvoice ? "Edit Invoice" : "Create New Invoice"}
        size="xl"
      >
        <InvoiceForm
          invoice={editingInvoice}
          onSubmit={handleSubmitInvoice}
          onCancel={() => {
            setShowModal(false);
            setEditingInvoice(null);
          }}
        />
      </Modal>
    </motion.div>
  );
};

export default InvoicesPage;