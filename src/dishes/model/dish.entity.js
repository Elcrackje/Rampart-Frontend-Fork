export class DishEntity {
    constructor({id = 0, name_of_dish = '', description = '',average_price= 0,order_count = 0}) {
        this.id = id;
        this.name_of_dish = name_of_dish;
        this.description = description;
        this.average_price = average_price;
        this.order_count = order_count;

    }
}