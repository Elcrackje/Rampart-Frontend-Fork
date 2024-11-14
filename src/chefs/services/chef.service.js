import http from "../../shared/services/http-common.js";

export class ChefService {
    resourceEndpoint = '/chefs';

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(chefResource) {
        return http.post(this.resourceEndpoint, chefResource);
    }

    update(id, chefResource) {
        return http.put(`${this.resourceEndpoint}/${id}`, chefResource);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    findByFavorite() {
        return http.get(`${this.resourceEndpoint}?favorite=true`); // Asumiendo que el endpoint puede filtrar por favorito
    }
}