import http from "../../shared/services/http-common.js";

export class PostService {
    resourceEndpoint = '/posts';

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(Resource) {
        return http.post(this.resourceEndpoint, Resource);
    }

    update(id, Resource) {
        return http.put(`${this.resourceEndpoint}/${id}`, Resource);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    //Metodo para obtener las prepublicaciones
    getPrePosts() {
        const today = new Date().toISOString().split('T')[0];  // Fecha de hoy en formato 'YYYY-MM-DD'
        return http.get(`${this.resourceEndpoint}?publishDate_gte=${today}`);  // Filtrar posts cuya fecha de publicación sea mayor o igual a hoy
    }

}
