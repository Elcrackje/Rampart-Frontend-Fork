export class PostEntity {
    constructor({
                    id = 0,
                    dishId = 0,
                    stock = 0,
                    publishDate = null,
                }) {
        this.id = id;
        this.dishId = dishId;
        this.stock = stock;
        this.publishDate = publishDate;
    }
}
