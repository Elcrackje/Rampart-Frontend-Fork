import http from "../../shared/services/http-common.js";


export class OrderService {

    getAll() {
        return http.get('/orders');
    }

    create(Resource) {
        return http.post('/orders', Resource);
    }

    update(id, Resource) {
        return http.put(`/orders/${id}`, Resource);
    }

    delete(id) {
        return http.delete(`/orders/${id}`);
    }
}
