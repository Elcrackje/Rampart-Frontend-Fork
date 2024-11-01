import http from "../../shared/services/http-common.js";

export class UserProfileService {
    resourceEndpoint = '/userProfile';

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(user) {
        return http.post(this.resourceEndpoint, user);
    }

    update(id, user) {
        return http.put(`${this.resourceEndpoint}/${id}`, user);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }
}
