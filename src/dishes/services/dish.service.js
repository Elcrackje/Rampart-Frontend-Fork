import http from "../../shared/services/http-common.js";
import axios from "axios";

export class DishService {
    resourceEndpoint = '/dishes';

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(dishResource) {
        return http.post(this.resourceEndpoint, dishResource);
    }

    update(id, dishResource) {
        return http.put(`${this.resourceEndpoint}/${id}`, dishResource);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    findByFavorite() {
        return http.get(`${this.resourceEndpoint}?favorite=true`);
    }

}