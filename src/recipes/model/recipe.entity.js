export class RecipeEntity {
    constructor({id = 0, name_of_dish = '', posted_by = '', ingredients='',preparation_steps=''}) {
        this.id = id;
        this.name_of_dish = name_of_dish;
        this.posted_by = posted_by;
        this.ingredients = ingredients;
        this.preparation_steps = preparation_steps;
    }
}