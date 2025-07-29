import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "@/components/atoms/Modal";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const PaymentModal = ({ isOpen, onClose, invoice, onPaymentRecord }) => {
  const [formData, setFormData] = useState({
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "check", label: "Check" },
    { value: "bank_transfer", label: "Bank Transfer" }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (parseFloat(formData.amount) > invoice.remainingBalance) {
      newErrors.amount = "Amount cannot exceed remaining balance";
    }
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onPaymentRecord(invoice.Id, formData);
      setFormData({
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
        notes: ""
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
      notes: ""
    });
    setErrors({});
    onClose();
  };

  if (!invoice) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Record Payment"
      size="md"
    >
      <div className="p-6">
        {/* Invoice Summary */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">{invoice.invoiceNumber}</h3>
              <p className="text-sm text-slate-600">
                Due: {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Total Amount</p>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(invoice.total)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Total Paid:</span>
              <span className="ml-2 font-semibold text-green-600">
                {formatCurrency(invoice.totalPaid || 0)}
              </span>
            </div>
            <div>
              <span className="text-slate-600">Remaining:</span>
              <span className="ml-2 font-semibold text-primary-600">
                {formatCurrency(invoice.remainingBalance)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Amount *
            </label>
            <Input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              max={invoice.remainingBalance}
              error={errors.amount}
              className="w-full"
            />
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Date *
            </label>
            <Input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleInputChange}
              error={errors.paymentDate}
              className="w-full"
            />
            {errors.paymentDate && (
              <p className="text-red-600 text-sm mt-1">{errors.paymentDate}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Method *
            </label>
            <Select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              options={paymentMethods}
              error={errors.paymentMethod}
              className="w-full"
            />
            {errors.paymentMethod && (
              <p className="text-red-600 text-sm mt-1">{errors.paymentMethod}</p>
            )}
          </div>

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
              placeholder="Optional payment notes..."
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <ApperIcon name="CreditCard" className="w-4 h-4 mr-2" />
                  Record Payment
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PaymentModal;