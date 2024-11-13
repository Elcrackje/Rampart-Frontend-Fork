export class PostEntity {
    constructor({
                    id = 0,
                    dishId = 0,
                    stock = 0,
                    publishDate = null,
                    pricePerUnit = 0
                }) {
        this.id = id;
        this.dishId = dishId;
        this.stock = stock;
        this.publishDate = publishDate;
        this.pricePerUnit = pricePerUnit;
    }
}
