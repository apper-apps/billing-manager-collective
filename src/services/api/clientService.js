import clientsData from "@/services/mockData/clients.json";

class ClientService {
  constructor() {
    this.clients = [...clientsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.clients];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const client = this.clients.find(client => client.Id === parseInt(id));
    if (!client) {
      throw new Error("Client not found");
    }
    return { ...client };
  }

  async create(clientData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.clients.map(client => client.Id), 0);
    const newClient = {
      ...clientData,
      Id: maxId + 1
    };
    this.clients.push(newClient);
    return { ...newClient };
  }

  async update(id, clientData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.clients.findIndex(client => client.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Client not found");
    }
    
    const updatedClient = {
      ...clientData,
      Id: parseInt(id)
    };
    
    this.clients[index] = updatedClient;
    return { ...updatedClient };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.clients.findIndex(client => client.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Client not found");
    }
    this.clients.splice(index, 1);
    return true;
  }
}

export const clientService = new ClientService();