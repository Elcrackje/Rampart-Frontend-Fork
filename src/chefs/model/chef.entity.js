export class ChefEntity {
    constructor({id = 0, name = '', rating = 0.0, favorite = false, gender = ''}) {
        this.id = id;
        this.name = name;
        this.favorite = favorite;
        this.gender = gender;

        // Asegurarse de que rating sea un número flotante (decimal)
        this.rating = this.validateRating(rating); // Validamos el rating

        // Generar la URL de la imagen automáticamente a partir del género
        if (this.gender === 'masculino') {
            this.imageUrl = 'https://github.com/Rampart-SaboresCercanos/FrontEnd/blob/develop/src/assets/chefs/masculino.png?raw=true';
        } else if (this.gender === 'femenino') {
            this.imageUrl = 'https://github.com/Rampart-SaboresCercanos/FrontEnd/blob/develop/src/assets/chefs/femenino.png?raw=true';
        }
    }

    validateRating(rating) {
        const parsedRating = parseFloat(rating); // Convertir a número flotante
        return isNaN(parsedRating) ? 0.0 : parsedRating; // Si no es un número válido, asignar 0.0
    }
}