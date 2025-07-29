import { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ServiceForm = ({ service, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    unit: ""
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    }
  }, [service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price) || 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Service Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="Web Design"
        />
        
        <Input
          label="Unit"
          name="unit"
          value={formData.unit}
          onChange={handleInputChange}
          placeholder="hour, project, page"
        />

        <div className="md:col-span-2">
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Detailed description of the service"
          />
        </div>

        <Input
          label="Price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleInputChange}
          required
          placeholder="0.00"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-primary-600 to-primary-700">
          <ApperIcon name="Save" className="w-4 h-4 mr-2" />
          {service ? "Update Service" : "Add Service"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;