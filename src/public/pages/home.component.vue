<script>
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      popularDishes: []
    };
  },
  methods: {
    async fetchPopularDishes() {
      try {
        // Obtener las publicaciones y los chefs
        const [postsResponse, chefsResponse] = await Promise.all([
          axios.get('http://localhost:3000/posts'),
          axios.get('http://localhost:3000/chefs')
        ]);

        const posts = postsResponse.data;
        const chefs = chefsResponse.data;

        // Obtener la fecha actual en formato YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        // Filtrar publicaciones que coinciden con la fecha actual
        const todaysPosts = posts.filter(post => post.publishDate === today);

        this.popularDishes = todaysPosts.map(post => {
          const chef = chefs.find(chef => chef.id === post.chefId);
          return {
            id: post.id,
            name: post.dishName,
            image: post.image,
            cookName: chef ? chef.name : 'Desconocido',
            orders: post.orders || 0,
            rating: chef ? chef.rating : 0,
            stock: post.stock || 0,
            chefId: post.chefId,  // Asegúrate de incluir chefId
            ingredients: post.ingredients || [],  // Asegúrate de incluir ingredients
            paymentMethods: post.paymentMethods || [],  // Asegúrate de incluir paymentMethods
            publishDate: post.publishDate // Asegúrate de incluir publishDate
          };
        }).sort((a, b) => b.rating - a.rating) // Ordenar por rating de mayor a menor
            .slice(0, 4); // Obtener las 4 mejores
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    },
    goToMorePosts() {
      this.$router.push('/posts'); // Redirigir a la página de publicaciones
    }
  },
  async mounted() {
    await this.fetchPopularDishes(); // Llamar a la función para obtener platos al montar el componente
  },
}
</script>


<template>
  <div class="home-page">
    <!-- Sección de bienvenida -->
    <section class="welcome-section">
      <h2>¡Bienvenido, Diego!</h2>
      <p>Explora deliciosos platos y haz tu pedido.</p>
    </section>

    <!-- Sección de platos populares -->
    <section class="popular-dishes">
      <h2>Platos Más Populares</h2>
      <div class="dishes-container">
        <div class="dish-card" v-for="dish in popularDishes" :key="dish.id">
          <img :src="dish.image" :alt="dish.name" class="dish-image" />
          <div class="dish-info">
            <h3>{{ dish.name }}</h3>  <!-- Nombre del plato -->
            <p>Cocinero: {{ dish.cookName }}</p>  <!-- Nombre del chef -->
            <p>Rating: {{ dish.rating }} ⭐</p>  <!-- Rating del chef -->
          </div>
        </div>
      </div>

      <!-- Botón para ver más publicaciones -->
      <pv-button
          label="Ver Más Publicaciones"
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
  height: auto;
  text-align: center;
  padding: 50px 20px;
  background-color: #f8f9fa;
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