<script>
import { PostService } from '/src/posting/services/posts.service.js';
import { ChefService } from '/src/chefs/services/chef.service.js';
import { DishService } from '/src/dishes/services/dish.service.js';
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      popularDishes: [],
      postService: new PostService(),  // Instancia del servicio PostService
      chefService: new ChefService(),  // Instancia del servicio ChefService
      dishService: new DishService()   // Instancia del servicio DishService
    };
  },
  methods: {
    async fetchPopularDishes() {
      try {
        // Obtener las publicaciones, los chefs y los platos
        const [postsResponse, chefsResponse, dishesResponse] = await Promise.all([
          this.postService.getAll(),  // Obtener todos los posts
          this.chefService.getAll(),  // Obtener todos los chefs
          this.dishService.getAll()   // Obtener todos los platos
        ]);

        const posts = postsResponse.data;
        const chefs = chefsResponse.data;
        const dishes = dishesResponse.data;

        console.log(posts); // Verifica los posts
        console.log(chefs); // Verifica los chefs
        console.log(dishes); // Verifica los dishes

        // Obtener la fecha actual en formato YYYY-MM-DD
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const threeDaysAgoFormatted = threeDaysAgo.toISOString().split('T')[0];

        const recentPosts = posts.filter(post => post.publishDate >= threeDaysAgoFormatted);
        console.log(recentPosts); // Verifica los platos recientes

        // Mapear publicaciones con información adicional
        this.popularDishes = recentPosts.map(post => {
          try {
            const dish = dishes.find(dish => dish.id === post.dishId);
            const chef = chefs.find(chef => chef.id === dish?.chefId);

            return {
              id: post.id,
              name: dish ? dish.nameOfDish : 'Desconocido',
              cookName: chef ? chef.name : 'Desconocido',
              rating: chef ? chef.rating : 0,
              stock: post.stock || 0,
              publishDate: post.publishDate
            };
          } catch (error) {
            console.error('Error al procesar el plato:', post, error);
            return null; // Devuelve null si hay un error
          }
        }).filter(dish => dish !== null) // Filtra platos nulos
            .sort((a, b) => b.stock - a.stock) // Ordenar por stock de mayor a menor
            .slice(0, 4); // Obtener los 4 con mayor stock
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    },
    goToMorePosts() {
      this.$router.push('/posts'); // Redirigir a la página de publicaciones
    }
  },
  async mounted() {
    await this.fetchPopularDishes();
    console.log('Platos populares:', this.popularDishes); // Verificar los datos
  },
}
</script>

<template>
  <div class="home-page">
    <!-- Sección de bienvenida -->
    <section class="welcome-section">
      <h2>{{ $t('home.welcomeMessage', { name: 'Diego' }) }}</h2>
      <p>{{ $t('home.explorePrompt') }}</p>
    </section>

    <!-- Sección de platos populares -->
    <section class="popular-dishes">
      <h2>{{ $t('home.popularDishes') }}</h2>
      <div class="dishes-container">
        <div class="dish-card" v-for="dish in popularDishes" :key="dish.id">
          <div class="dish-info">
            <h3>{{ dish.name }}</h3> <!-- Nombre del plato -->
            <p>{{ $t('home.cookName', { name: dish.cookName }) }}</p> <!-- Nombre del chef -->
            <p>{{ $t('home.rating', { rating: dish.rating }) }}</p> <!-- Rating del chef -->
            <p>{{ $t('home.orders', { count: dish.stock }) }}</p> <!-- Pedidos -->
          </div>
        </div>
      </div>

      <!-- Botón para ver más publicaciones -->
      <pv-button
          :label="$t('home.viewMorePosts')"
          icon="pi pi-arrow-right"
          class="p-button-success"
          @click="goToMorePosts"
          style="margin-top: 20px;"
      />
    </section>
  </div>
</template>

<style scoped>
.home-page {
  align-content: center;
  height: 80vh;
  text-align: center;
  padding: 50px 20px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #333;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #555;
}

.register-button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.register-button:hover {
  background-color: #218838;
}

.popular-dishes {
  padding: 40px 20px;
}

.popular-dishes h2 {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #333;
}

.dishes-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.dish-card {
  width: 250px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  padding: 10px;
}

.dish-card:hover {
  transform: translateY(-5px);
}

.dish-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.dish-info {
  padding: 15px;
}

.dish-info h3 {
  font-size: 1.25rem;
  margin-bottom: 10px;
  color: #333;
}

.dish-info p {
  font-size: 1rem;
  color: #555;
}
</style>