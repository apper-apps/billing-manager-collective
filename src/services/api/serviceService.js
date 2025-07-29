import servicesData from "@/services/mockData/services.json";

class ServiceService {
  constructor() {
    this.services = [...servicesData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.services];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const service = this.services.find(service => service.Id === parseInt(id));
    if (!service) {
      throw new Error("Service not found");
    }
    return { ...service };
  }

  async create(serviceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.services.map(service => service.Id), 0);
    const newService = {
      ...serviceData,
      Id: maxId + 1
    };
    this.services.push(newService);
    return { ...newService };
  }

  async update(id, serviceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.services.findIndex(service => service.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Service not found");
    }
    
    const updatedService = {
      ...serviceData,
      Id: parseInt(id)
    };
    
    this.services[index] = updatedService;
    return { ...updatedService };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.services.findIndex(service => service.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Service not found");
    }
    this.services.splice(index, 1);
    return true;
  }
}

export const serviceService = new ServiceService();