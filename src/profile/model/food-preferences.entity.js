// model/food-preferences.js
export class FoodPreferences {
    constructor({ id = null, preferences = {} }) {
        this.id = id;
        this.preferences = {
            pollosYParrillas: preferences.pollosYParrillas || false,
            pizzas: preferences.pizzas || false,
            sushi: preferences.sushi || false,
            hamburguesasYSandwiches: preferences.hamburguesasYSandwiches || false,
            pescadosYMariscos: preferences.pescadosYMariscos || false,
            comidaChina: preferences.comidaChina || false,
            comidaInternacional: preferences.comidaInternacional || false,
            comidaSaludable: preferences.comidaSaludable || false,
            comidaVegetariana: preferences.comidaVegetariana || false,
            comidaVegana: preferences.comidaVegana || false,
            comidaSinGluten: preferences.comidaSinGluten || false,
            desayunos: preferences.desayunos || false,
            postresYTortas: preferences.postresYTortas || false,
        };
    }
}
