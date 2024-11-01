export class ChefEntity {

    constructor({id = 0, name = '', rating = 0.0, favorite = false, imageUrl = ''}) {
        this.id = id;
        this.name = name;
        this.rating = rating;
        this.favorite = favorite;
        this.imageUrl = imageUrl; // Nuevo atributo para la URL de la imagen
    }
}