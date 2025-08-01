import invoicesData from "@/services/mockData/invoices.json";

class InvoiceService {
constructor() {
    this.invoices = [...invoicesData].map(invoice => ({
      ...invoice,
      paymentTerms: invoice.paymentTerms || "Net 30",
      invoicePrefix: invoice.invoicePrefix || "INV",
      startingNumber: invoice.startingNumber || 1,
      taxRate: invoice.taxRate || 10,
      totalPaid: invoice.totalPaid || 0,
      remainingBalance: invoice.remainingBalance || invoice.total,
      payments: invoice.payments || []
    }));
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.invoices];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const invoice = this.invoices.find(invoice => invoice.Id === parseInt(id));
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    return { ...invoice };
  }

async create(invoiceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Validate line items
    const validLineItems = invoiceData.lineItems?.filter(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      return quantity > 0 && rate > 0;
    }) || [];
    
    if (validLineItems.length === 0) {
      throw new Error("At least one line item with quantity and rate values is required");
    }
    
    const maxId = Math.max(...this.invoices.map(invoice => invoice.Id), 0);
    
    // Generate sequential invoice number
    const prefix = invoiceData.invoicePrefix || "INV";
    const startingNumber = parseInt(invoiceData.startingNumber) || 1;
    
    // Find the highest number with this prefix
    const prefixInvoices = this.invoices.filter(inv => 
      inv.invoiceNumber && inv.invoiceNumber.startsWith(prefix + "-")
    );
    
    let nextNumber = startingNumber;
    if (prefixInvoices.length > 0) {
      const numbers = prefixInvoices.map(inv => {
        const numPart = inv.invoiceNumber.split("-").pop();
        return parseInt(numPart) || 0;
      });
      nextNumber = Math.max(...numbers, startingNumber - 1) + 1;
    }
    
    const invoiceNumber = `${prefix}-${String(nextNumber).padStart(3, '0')}`;
    
    const newInvoice = {
      ...invoiceData,
      Id: maxId + 1,
      invoiceNumber,
      issueDate: new Date(invoiceData.issueDate).toISOString(),
      dueDate: new Date(invoiceData.dueDate).toISOString(),
      paymentTerms: invoiceData.paymentTerms || "Net 30",
      invoicePrefix: prefix,
      startingNumber: startingNumber,
      taxRate: parseFloat(invoiceData.taxRate) || 10,
      totalPaid: 0,
      remainingBalance: invoiceData.total,
      payments: []
    };
    this.invoices.push(newInvoice);
    return { ...newInvoice };
  }

async update(id, invoiceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.invoices.findIndex(invoice => invoice.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Invoice not found");
    }
    
    // Validate line items
    const validLineItems = invoiceData.lineItems?.filter(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      return quantity > 0 && rate > 0;
    }) || [];
    
    if (validLineItems.length === 0) {
      throw new Error("At least one line item with quantity and rate values is required");
    }
    
    const updatedInvoice = {
      ...invoiceData,
      Id: parseInt(id),
      issueDate: new Date(invoiceData.issueDate).toISOString(),
      dueDate: new Date(invoiceData.dueDate).toISOString(),
      paymentTerms: invoiceData.paymentTerms || "Net 30",
      invoicePrefix: invoiceData.invoicePrefix || "INV",
      startingNumber: invoiceData.startingNumber || 1,
      taxRate: parseFloat(invoiceData.taxRate) || 10
    };
    
    this.invoices[index] = updatedInvoice;
    return { ...updatedInvoice };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.invoices.findIndex(invoice => invoice.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Invoice not found");
    }
    this.invoices.splice(index, 1);
    return true;
  }

  async recordPayment(invoiceId, paymentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.invoices.findIndex(invoice => invoice.Id === parseInt(invoiceId));
    if (index === -1) {
      throw new Error("Invoice not found");
    }

    const invoice = this.invoices[index];
    const paymentAmount = parseFloat(paymentData.amount);
    
    if (paymentAmount <= 0) {
      throw new Error("Payment amount must be greater than 0");
    }
    
    if (paymentAmount > invoice.remainingBalance) {
      throw new Error("Payment amount cannot exceed remaining balance");
    }

    const maxPaymentId = Math.max(
      ...invoice.payments.map(payment => payment.Id || 0),
      0
    );

    const newPayment = {
      Id: maxPaymentId + 1,
      amount: paymentAmount,
      paymentDate: new Date(paymentData.paymentDate).toISOString(),
      paymentMethod: paymentData.paymentMethod,
      notes: paymentData.notes || ""
    };

    const updatedPayments = [...invoice.payments, newPayment];
    const newTotalPaid = invoice.totalPaid + paymentAmount;
    const newRemainingBalance = invoice.total - newTotalPaid;
    
    let newStatus = invoice.status;
    if (newRemainingBalance === 0) {
      newStatus = "paid";
    } else if (newTotalPaid > 0 && invoice.status !== "paid") {
      newStatus = "partially_paid";
    }

    this.invoices[index] = {
      ...invoice,
      payments: updatedPayments,
      totalPaid: newTotalPaid,
      remainingBalance: newRemainingBalance,
      status: newStatus
    };

    return { ...this.invoices[index] };
  }

  async getPaymentHistory(invoiceId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const invoice = this.invoices.find(invoice => invoice.Id === parseInt(invoiceId));
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    return [...invoice.payments];
  }

  calculatePaymentSummary(invoice) {
    const totalPaid = invoice.totalPaid || 0;
    const remainingBalance = invoice.total - totalPaid;
    const paymentPercentage = invoice.total > 0 ? (totalPaid / invoice.total) * 100 : 0;
    
    return {
      totalPaid,
      remainingBalance,
      paymentPercentage: Math.round(paymentPercentage * 100) / 100,
      isFullyPaid: remainingBalance === 0,
      isPartiallyPaid: totalPaid > 0 && remainingBalance > 0
    };
  }
}

export const invoiceService = new InvoiceService();