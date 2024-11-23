<template>
  <div>
    <!-- Sección de Chefs Favoritos -->
    <h1 class="section-title">{{ $t('favorites.chefs') }}</h1>
    <div class="grid-container">
      <div v-for="chef in chefs.filter(chef => chef.isFavorite)" :key="chef.id" class="card-item">
        <pv-card>
          <template #header>
            <div class="header-container">
              <button class="favorite-button" @click="toggleFavorite(chef)">
                <i :class="chef.favorite ? 'fas fa-heart favorite-icon red-heart' : 'fas fa-heart favorite-icon red-heart'"></i>
              </button>
            </div>
            <h3>{{ chef.name }}</h3>
          </template>
          <template #content>
            <img :src="chef.imageUrl" alt="Imagen de {{ chef.name }}" class="chef-image" />
            <p><strong>{{ $t('favorites.rating') }}:</strong> {{ chef.rating }}</p>
          </template>
        </pv-card>
      </div>
    </div>

    <!-- Sección de Recetas Favoritas -->
    <h1 class="section-title">{{ $t('favorites.recipes') }}</h1>
    <div class="grid-container">
      <div v-for="dish in dishes" :key="dish.id" class="card-item">
        <pv-card>
          <template #header>
            <div class="header-container">
              <button class="favorite-button" @click="toggleFavorite1(dish)">
                <i :class="dish.favorite ? 'fas fa-heart favorite-icon red-heart' : 'fas fa-heart favorite-icon red-heart'"></i>
              </button>
            </div>
            <h3>{{ dish.nameOfDish }}</h3>
          </template>
          <template #content>
            <p><strong>{{ $t('favorites.publishedBy') }}:</strong> {{ getChefFromId(dish.chefId)?.name || $t('favorites.unknownChef') }}</p>
            <p><strong>{{ $t('favorites.ingredients') }}:</strong></p>
            <ul>
              <li v-for="ingredient in dish.ingredients" :key="ingredient">{{ ingredient }}</li>
            </ul>
            <p><strong>{{ $t('favorites.preparationSteps') }}:</strong></p>
            <ol>
              <li v-for="step in dish.preparationSteps" :key="step">{{ step }}</li>
            </ol>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ChefEntity } from "../../chefs/model/chef.entity.js";
import { ChefService } from "../../chefs/services/chef.service.js";
import { DishEntity } from "../../dishes/model/dish.entity.js";
import { DishService } from "../../dishes/services/dish.service.js";

export default {
  name: "favorite-page.component",
  data() {
    return {
      chefs: [], // Lista de chefs favoritos
      dishes: [], // Lista de recetas favoritas
      chefdish: [], // Lista de todos los chefs
      chefService: new ChefService(), // Servicio de chefs
      dishService: new DishService(), // Servicio de platos
    };
  },
  methods: {
    // Método para obtener chef por ID
    getChefFromId(id) {
      return this.chefs.find((chef) => chef.id === id);
    },
    // Método para alternar el estado de favorito de un chef
    async toggleFavorite(chef) {
      chef.isFavorite = !chef.isFavorite;
      try {
        await this.chefService.update(chef.id, chef);
        if (!chef.isFavorite) {
          this.chefs = this.chefs.filter(c => c.id !== chef.id);
        }
      } catch (error) {
        console.error("Error actualizando el estado de favorito:", error);
      }
    },
    // Método para alternar el estado de favorito de una receta
    async toggleFavorite1(dish) {
      dish.favorite = !dish.favorite;
      try {
        await this.dishService.update(dish.id, dish);
        if (!dish.favorite) {
          this.dishes = this.dishes.filter(d => d.id !== dish.id);
        }
      } catch (error) {
        console.error("Error actualizando el estado de favorito:", error);
      }
    },
  },
  created() {
    // Cargar chefs favoritos
    this.chefService.findByFavorite().then((response) => {
      this.chefs = response.data.map((chef) => new ChefEntity(chef));
    }).catch((error) => console.error(error));

    // Cargar recetas favoritas
    this.dishService.findByFavorite().then((response) => {
      this.dishes = response.data.map((dish) => new DishEntity(dish));
    }).catch((error) => console.error(error));

    // Obtener todos los chefs
    this.chefService.getAll().then(response => {
      this.chefdish = response.data.map((chefdish) => new ChefEntity(chefdish));
    }).catch(error => {
      console.error("Error obteniendo chefs:", error);
    });
  },
};
</script>

<style scoped>
.section-title {
  color: #808080; /* Color gris */
  margin-top: 2rem; /* Espacio superior */
  margin-bottom: 1rem; /* Espacio inferior para separar del contenido */
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Mantener la distribución en columnas */
  gap: 1rem; /* Espaciado entre las tarjetas */
}

.card-item {
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Asegura que las tarjetas se mantengan en la misma altura */
}

.header-container {
  display: flex;
  align-items: center; /* Alinear verticalmente el texto y el ícono */
  position: relative; /* Permite el posicionamiento absoluto dentro */
}

.favorite-button {
  position: absolute; /* Coloca el botón en la esquina superior izquierda */
  top: 10px; /* Ajusta la distancia desde la parte superior */
  left: 10px; /* Ajusta la distancia desde la izquierda */
  background: transparent; /* Sin fondo */
  border: none; /* Sin borde */
  cursor: pointer; /* Cambiar cursor al pasar */
  z-index: 1; /* Asegura que esté por encima de otros elementos */
}

.favorite-icon {
  font-size: 1.5em; /* Tamaño del ícono */
}

.red-heart {
  color: red; /* Color rojo para el corazón */
}

.chef-image {
  width: 100px;
  height: 100px;
  border-radius: 50%; /* Hacer la imagen redonda */
  object-fit: cover; /* Ajustar la imagen dentro del contenedor */
  margin: 10px 0;
}

.pv-card {
  background-color: #fff; /* Fondo blanco para las tarjetas */
  border-radius: 15px; /* Bordes redondeados */
  box-shadow: 0 4px 20px rgba(255, 0, 0, 0.3); /* Sombra roja */
  margin: 15px;
  padding: 20px; /* Espaciado interno */
  transition: transform 0.3s, box-shadow 0.3s; /* Efecto al pasar el ratón */
}

.pv-card:hover {
  transform: translateY(-5px); /* Efecto de elevar la tarjeta */
  box-shadow: 0 8px 40px rgba(255, 0, 0, 0.5); /* Sombra más intensa al pasar el ratón */
}

.pv-card h3 {
  color: #4a4a4a; /* Color de los encabezados */
  font-size: 1.5em;
  margin: 0 0 10px;
}

.pv-card p {
  color: #666; /* Color del texto */
  line-height: 1.6; /* Espaciado entre líneas */
  margin: 5px 0;
}

.pv-card strong {
  color: #333; /* Color de los textos en negrita */
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f7f7f7; /* Color de fondo suave */
  margin: 0;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 2em;
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .grid-container {
    grid-template-columns: 1fr; /* Coloca las tarjetas en una sola columna en pantallas pequeñas */
  }
}
.section-title {
  padding-top: 60px
}
</style>