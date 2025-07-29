import invoicesData from "@/services/mockData/invoices.json";

class InvoiceService {
  constructor() {
    this.invoices = [...invoicesData];
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
    const maxId = Math.max(...this.invoices.map(invoice => invoice.Id), 0);
    const newInvoice = {
      ...invoiceData,
      Id: maxId + 1,
      issueDate: new Date(invoiceData.issueDate).toISOString(),
      dueDate: new Date(invoiceData.dueDate).toISOString()
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
    
    const updatedInvoice = {
      ...invoiceData,
      Id: parseInt(id),
      issueDate: new Date(invoiceData.issueDate).toISOString(),
      dueDate: new Date(invoiceData.dueDate).toISOString()
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
}

export const invoiceService = new InvoiceService();