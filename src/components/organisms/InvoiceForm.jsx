import { useState, useEffect } from "react";
import PaymentHistory from "@/components/organisms/PaymentHistory";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import ApperIcon from "@/components/ApperIcon";
import ClientForm from "@/components/organisms/ClientForm";
import ServiceForm from "@/components/organisms/ServiceForm";
import { clientService } from "@/services/api/clientService";
import { serviceService } from "@/services/api/serviceService";
import { toast } from "react-toastify";

const InvoiceForm = ({ invoice, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
invoiceNumber: "",
    clientId: "",
    status: "draft",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    lineItems: [{ serviceId: "", description: "", quantity: 1, rate: 0, amount: 0 }],
    notes: "",
    subtotal: 0,
    tax: 0,
    total: 0,
    totalPaid: 0,
    remainingBalance: 0,
    payments: []
  });

const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClientModal, setShowClientModal] = useState(false);
const [showServiceModal, setShowServiceModal] = useState(false);
  const [activeLineItemIndex, setActiveLineItemIndex] = useState(null);
  useEffect(() => {
    loadData();
  }, []);

useEffect(() => {
    if (invoice) {
      setFormData({
        ...invoice,
        issueDate: invoice.issueDate.split("T")[0],
        dueDate: invoice.dueDate.split("T")[0],
        totalPaid: invoice.totalPaid || 0,
        remainingBalance: invoice.remainingBalance || invoice.total,
        payments: invoice.payments || []
      });
    }
  }, [invoice]);

  useEffect(() => {
    calculateTotals();
  }, [formData.lineItems]);

  const loadData = async () => {
    try {
      const [clientsData, servicesData] = await Promise.all([
        clientService.getAll(),
        serviceService.getAll()
      ]);
      setClients(clientsData);
      setServices(servicesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedItems = [...formData.lineItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // If service is selected, populate description and rate
    if (field === "serviceId" && value) {
      const service = services.find(s => s.Id === parseInt(value));
      if (service) {
        updatedItems[index].description = service.name;
        updatedItems[index].rate = service.price;
      }
    }

    // Calculate amount
    const quantity = parseFloat(updatedItems[index].quantity) || 0;
    const rate = parseFloat(updatedItems[index].rate) || 0;
    updatedItems[index].amount = quantity * rate;

    setFormData(prev => ({
      ...prev,
      lineItems: updatedItems
    }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { serviceId: "", description: "", quantity: 1, rate: 0, amount: 0 }
      ]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length > 1) {
      const updatedItems = formData.lineItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        lineItems: updatedItems
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate invoice number if creating new
    if (!invoice) {
      const invoiceNumber = `INV-${Date.now()}`;
      formData.invoiceNumber = invoiceNumber;
    }

    onSubmit(formData);
  };

const handleCreateClient = async (clientData) => {
    try {
      const newClient = await clientService.create(clientData);
      setClients(prev => [...prev, newClient]);
      setFormData(prev => ({ ...prev, clientId: newClient.Id }));
      setShowClientModal(false);
      toast.success("Client created successfully!");
    } catch (error) {
      toast.error("Failed to create client");
    }
  };

  const handleCreateService = async (serviceData) => {
    try {
      const newService = await serviceService.create(serviceData);
      setServices(prev => [...prev, newService]);
      setShowServiceModal(false);
      toast.success("Service created successfully!");
    } catch (error) {
      toast.error("Failed to create service");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Invoice Number"
          name="invoiceNumber"
          value={formData.invoiceNumber}
          onChange={handleInputChange}
          placeholder="Will be auto-generated"
          disabled={!!invoice}
        />
        
<div className="space-y-2">
          <Select
            label="Client"
            name="clientId"
            value={formData.clientId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.Id} value={client.Id}>
                {client.name} - {client.company}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowClientModal(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add New Client
          </Button>
        </div>

        <Input
          label="Issue Date"
          name="issueDate"
          type="date"
          value={formData.issueDate}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleInputChange}
          required
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </Select>
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Line Items</h3>
          <Button type="button" onClick={addLineItem} size="sm">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {formData.lineItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 p-4 rounded-lg border border-slate-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-3">
<div className="space-y-2">
                    <Select
                      label="Service"
                      value={item.serviceId}
                      onChange={(e) => handleLineItemChange(index, "serviceId", e.target.value)}
                    >
                      <option value="">Select service</option>
                      {services.map(service => (
                        <option key={service.Id} value={service.Id}>
                          {service.name}
                        </option>
                      ))}
                    </Select>
                    <Button
                      type="button"
                      variant="secondary"
size="sm"
                      onClick={() => {
                        setActiveLineItemIndex(index);
                        setShowServiceModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <ApperIcon name="Plus" className="w-3 h-3" />
                      Add Service
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <Input
                    label="Description"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(index, "description", e.target.value)}
                    placeholder="Item description"
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, "quantity", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => handleLineItemChange(index, "rate", e.target.value)}
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount
                  </label>
                  <div className="text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2">
                    {formatCurrency(item.amount)}
                  </div>
                </div>

                <div className="md:col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLineItem(index)}
                    disabled={formData.lineItems.length === 1}
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

      {/* Totals */}
<div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-lg border border-slate-200">
        <div className="space-y-2 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span className="text-slate-600">Subtotal:</span>
            <span className="font-semibold">{formatCurrency(formData.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Tax (10%):</span>
            <span className="font-semibold">{formatCurrency(formData.tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span className="text-primary-700">{formatCurrency(formData.total)}</span>
          </div>
          {invoice && formData.totalPaid > 0 && (
            <>
              <div className="flex justify-between text-sm text-green-600 border-t pt-2">
                <span>Amount Paid:</span>
                <span className="font-semibold">{formatCurrency(formData.totalPaid)}</span>
              </div>
              <div className="flex justify-between text-sm text-primary-600">
                <span>Remaining Balance:</span>
                <span className="font-semibold">{formatCurrency(formData.remainingBalance)}</span>
              </div>
            </>
          )}
        </div>
      </div>

{/* Payment History */}
      {invoice && formData.payments && formData.payments.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-4">
            Payment History
          </label>
          <PaymentHistory 
            payments={formData.payments} 
            totalAmount={formData.total}
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          placeholder="Additional notes for this invoice..."
        />
      </div>
      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-primary-600 to-primary-700">
          <ApperIcon name="Save" className="w-4 h-4 mr-2" />
          {invoice ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
{/* Client Modal */}
      <Modal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        title="Add New Client"
        size="lg"
      >
        <ClientForm
          onSubmit={handleCreateClient}
          onCancel={() => setShowClientModal(false)}
        />
      </Modal>

      {/* Service Modal */}
      <Modal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        title="Add New Service"
        size="md"
      >
        <ServiceForm
          onSubmit={handleCreateService}
          onCancel={() => setShowServiceModal(false)}
        />
      </Modal>
    </form>
  );
};

export default InvoiceForm;