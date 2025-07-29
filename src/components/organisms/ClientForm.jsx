import { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ClientForm = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: ""
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="John Doe"
        />
        
        <Input
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          placeholder="Company Name"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          placeholder="john@company.com"
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="123 Main St, City, State 12345"
      />

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-primary-600 to-primary-700">
          <ApperIcon name="Save" className="w-4 h-4 mr-2" />
          {client ? "Update Client" : "Add Client"}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;