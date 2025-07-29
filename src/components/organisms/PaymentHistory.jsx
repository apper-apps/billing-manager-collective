import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const PaymentHistory = ({ payments = [], totalAmount = 0 }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "cash":
        return "Banknote";
      case "check":
        return "FileText";
      case "bank_transfer":
        return "CreditCard";
      default:
        return "DollarSign";
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "cash":
        return "Cash";
      case "check":
        return "Check";
      case "bank_transfer":
        return "Bank Transfer";
      default:
        return method;
    }
  };

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 text-center border border-slate-200">
        <ApperIcon name="Receipt" className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">No payments recorded</p>
        <p className="text-sm text-slate-500">
          Payment history will appear here once payments are recorded
        </p>
      </div>
    );
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-4">
      {/* Payment Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-900">
                {formatCurrency(totalPaid)} received
              </p>
              <p className="text-sm text-green-700">
                {payments.length} payment{payments.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
          </div>
          {totalAmount > 0 && (
            <div className="text-right">
              <p className="text-sm text-green-700">Payment Progress</p>
              <p className="font-bold text-green-900">
                {Math.round((totalPaid / totalAmount) * 100)}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment List */}
      <div className="space-y-3">
        <h4 className="font-medium text-slate-900 flex items-center gap-2">
          <ApperIcon name="History" className="w-4 h-4" />
          Payment History
        </h4>
        
        {payments
          .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
          .map((payment, index) => (
            <motion.div
              key={payment.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon 
                      name={getPaymentMethodIcon(payment.paymentMethod)} 
                      className="w-4 h-4 text-primary-600" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(payment.amount)}
                      </span>
                      <span className="text-sm px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {getPaymentMethodLabel(payment.paymentMethod)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      {format(new Date(payment.paymentDate), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                    {payment.notes && (
                      <p className="text-sm text-slate-700 bg-slate-50 rounded p-2">
                        {payment.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default PaymentHistory;