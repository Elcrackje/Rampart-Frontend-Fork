<template>
  <div>
    <h1 class="section-title">Chefs Favoritos</h1>
    <div class="grid-container">
      <div v-for="chef in chefs" :key="chef.id" class="card-item">
        <pv-card>
          <template #header>
            <div class="header-container">
              <button class="favorite-button" @click="toggleFavorite(chef)">
                <i :class="chef.favorite ? 'fas fa-heart favorite-icon red-heart' : 'far fa-heart favorite-icon red-heart'"></i>
              </button>
            </div>
            <h3>{{ chef.name }}</h3>
          </template>
          <template #content>
            <img :src="chef.imageUrl" alt="Imagen de {{ chef.name }}" class="chef-image" />
            <p><strong>Calificación:</strong> {{ chef.rating }}</p>
          </template>
        </pv-card>
      </div>
    </div>

    <h1 class="section-title">Recetas Favoritas</h1>
    <div class="grid-container">
      <div v-for="recipe in recipes" :key="recipe.id" class="card-item">
        <pv-card>
          <template #header>
            <div class="header-container">
              <button class="favorite-button" @click="toggleFavorite1(recipe)">
                <i :class="recipe.favorite ? 'fas fa-heart favorite-icon red-heart' : 'far fa-heart favorite-icon red-heart'"></i>
              </button>
            </div>
            <h3>{{ recipe.name_of_dish }}</h3>
          </template>
          <template #content>
            <p><strong>Publicado por:</strong> {{ recipe.posted_by }}</p>
            <p><strong>Ingredientes:</strong></p>
            <ul>
              <li v-for="ingredient in recipe.ingredients" :key="ingredient">{{ ingredient }}</li>
            </ul>
            <p><strong>Pasos de preparación:</strong></p>
            <ol>
              <li v-for="step in recipe.preparation_steps" :key="step">{{ step }}</li>
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
import { RecipeEntity } from "../../recipes/model/recipe.entity.js";
import { RecipeService } from "../../recipes/services/recipe.service.js";

export default {
  name: "recipe-list.component",
  data() {
    return {
      chefs: [],
      recipes: [],
      chefService: new ChefService(),
      recipeService: new RecipeService(),
    };
  },
  methods: {
    async toggleFavorite(chef) {
      chef.favorite = !chef.favorite;
      try {
        await this.chefService.update(chef.id, chef);
        if (!chef.favorite) {
          this.chefs = this.chefs.filter(c => c.id !== chef.id);
        }
      } catch (error) {
        console.error("Error updating favorite status:", error);
      }
    },
    async toggleFavorite1(recipe) {
      recipe.favorite = !recipe.favorite;
      try {
        await this.recipeService.update(recipe.id, recipe);
        if (!recipe.favorite) {
          this.recipes = this.recipes.filter(c => c.id !== recipe.id);
        }
      } catch (error) {
        console.error("Error updating favorite status:", error);
      }
    },
  },
  created() {
    this.chefService.findByFavorite().then((response) => {
      this.chefs = response.data.map((chef) => new ChefEntity(chef));
    }).catch((error) => console.error(error));

    this.recipeService.findByFavorite().then((response) => {
      this.recipes = response.data.map((recipe) => new RecipeEntity(recipe));
    }).catch((error) => console.error(error));
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
  color: #333; /* Color del texto */
  margin-bottom: 20px;
  font-size: 2em;
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .grid-container {
    grid-template-columns: 1fr; /* Coloca las tarjetas en una sola columna en pantallas pequeñas */
  }
}
</style>
