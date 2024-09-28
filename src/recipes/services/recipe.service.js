import http from "../../shared/services/http-common.js";

export class RecipeService {
    resourceEndpoint = '/recipes';

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(recipeResource) {
        return http.post(this.resourceEndpoint, recipeResource);
    }

    update(id, recipeResource) {
        return http.put(`${this.resourceEndpoint}/${id}`, recipeResource);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    //findByName(name) {
    //    return http.get(`${this.resourceEndpoint}?name=${name}`);
    //}
}