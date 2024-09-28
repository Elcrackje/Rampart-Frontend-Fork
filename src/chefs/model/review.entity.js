export class ReviewEntity {
    constructor({id = 0, userId = '', rate = 0.0, content = ""}) {
        this.id = id;
        this.userId = userId;
        this.rate = rate;
        this.content = content;
    }
}