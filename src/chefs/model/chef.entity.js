export class ChefEntity {
    constructor({ id = 0, name = '', rating = 0.0, isFavorite = false, gender = '' }) {
        this.id = id;
        this.name = name;
        this.isFavorite = isFavorite;
        this.gender = gender;

        // Validar y asignar el rating
        this.rating = this.validateRating(rating);

        // Generar la URL de la imagen automáticamente a partir del género
        if (this.gender === 'masculino') {
            this.imageUrl = 'https://github.com/Rampart-SaboresCercanos/FrontEnd/blob/develop/src/assets/chefs/masculino.png?raw=true';
        } else if (this.gender === 'femenino') {
            this.imageUrl = 'https://github.com/Rampart-SaboresCercanos/FrontEnd/blob/develop/src/assets/chefs/femenino.png?raw=true';
        }
    }

    validateRating(rating) {
        const parsedRating = parseFloat(rating);
        return isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5 ? 0.0 : parsedRating;
    }
}