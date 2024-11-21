
import axios from "axios";

const api = axios.create({
    baseURL: 'https://localhost:44331',// Reemplaza con la URL de tu backend
});

export class OrderService {
    //resourceEndpoint = '/orders';

    getAll() {
        return api.get('/api/v1/orders');
    }

    create(Resource) {
        return api.post('/api/v1/orders', Resource);
    }

    update(id, Resource) {
        return api.put(`/api/v1/orders/${id}`, Resource);
    }

    delete(id) {
        return api.delete(`/api/v1/orders/${id}`);
    }
}

export default api;