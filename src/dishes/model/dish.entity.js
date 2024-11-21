export class DishEntity {
    constructor({
                    id = 0,
                    chefId = 0,
                    nameOfDish = '',
                    ingredients = [],
                    preparationSteps = [],
                    favorite = false,
                    price="",
                }) {
        this.id = id;
        this.chefId = chefId;
        this.nameOfDish = nameOfDish;
        this.ingredients = ingredients;
        this.preparationSteps = preparationSteps;
        this.favorite = favorite;
        this.price = price;
    }
}